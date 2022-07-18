import { app, BrowserWindow, shell, ipcMain, session, protocol } from 'electron'
import { release } from 'os'
import { join, resolve } from 'path'
import { setNewWebContent } from './interflow'

// Disable GPU Acceleration for Windows 7
if (release().startsWith('6.1')) app.disableHardwareAcceleration()

// Set application name for Windows 10+ notifications
if (process.platform === 'win32') app.setAppUserModelId(app.getName())

if (!app.requestSingleInstanceLock()) {
  app.quit()
  process.exit(0)
}

process.env['ELECTRON_DISABLE_SECURITY_WARNINGS'] = 'true'

export const ROOT_PATH = {
  // /dist
  dist: join(__dirname, '../..'),
  // /dist or /public
  public: join(__dirname, app.isPackaged ? '../..' : '../../../public'),
}

let win: BrowserWindow | null = null
// Here, you can also use other preload
const preload = join(__dirname, '../preload/index.js')
// 🚧 Use ['ENV_NAME'] avoid vite:define plugin
const url = `http://${process.env['VITE_DEV_SERVER_HOST']}:${process.env['VITE_DEV_SERVER_PORT']}`
const indexHtml = join(ROOT_PATH.dist, 'index.html')

async function createWindow() {
  win = new BrowserWindow({
    title: 'Main window',
    icon: join(ROOT_PATH.public, 'favicon.ico'),
    width: 1366,
    height: 760,
    webPreferences: {
      preload,
      nodeIntegration: true,
      contextIsolation: true,
      webSecurity: false,
    },
  })

  if (app.isPackaged) {
    win.loadFile(indexHtml)
  } else {
    win.loadURL(url, {
      userAgent: 'Chrome11',
      httpReferrer: '',
      extraHeaders: 'a: b\n'
    })
    // win.webContents.openDevTools()
  }

  ipcMain.on('set-new-web-content', setNewWebContent)

  // Test actively push message to the Electron-Renderer
  win.webContents.on('did-finish-load', () => {
    win?.webContents.send('main-process-message', new Date().toLocaleString())
  })

  // Make all links open with the browser, not with the application
  win.webContents.setWindowOpenHandler(({ url }) => {
    if (url.startsWith('https:')) shell.openExternal(url)
    return { action: 'deny' }
  })

  const uri = resolve(process.cwd(), './devtools/chrome');
  try {
    await session.defaultSession.loadExtension(uri, {allowFileAccess: true});
  } catch (e) {
  }

  // 需要拦截的URL地址
  // const xxx_filter = {
  //   urls: ["https://*.com/*"]
  // }
  // session.defaultSession.webRequest.onBeforeSendHeaders(xxx_filter, (details, callback) => {
  //   console.log('zsf 改了')
  //   details.requestHeaders['Referer'] = 'http://account.crxn.cn/'
  //   details.requestHeaders['origin'] = 'http://account.crxn.cn/'
  //   callback({ requestHeaders: details.requestHeaders });
  // })

  const filter = {
    urls: [],
  };
  session.defaultSession.webRequest.onBeforeSendHeaders(filter, (details, callback) => {
    details.requestHeaders["token"] = 'token';
    callback({ cancel: false, requestHeaders: details.requestHeaders });
  });
}

app.whenReady().then(createWindow)

app.on('window-all-closed', () => {
  win = null
  if (process.platform !== 'darwin') app.quit()
})

app.on('second-instance', () => {
  if (win) {
    // Focus on the main window if the user tried to open another
    if (win.isMinimized()) win.restore()
    win.focus()
  }
})

app.on('activate', () => {
  const allWindows = BrowserWindow.getAllWindows()
  if (allWindows.length) {
    allWindows[0].focus()
  } else {
    createWindow()
  }
})

// new window example arg: new windows url
ipcMain.handle('open-win', (event, arg) => {
  const childWindow = new BrowserWindow({
    webPreferences: {
      preload,
    },
  })

  if (app.isPackaged) {
    childWindow.loadFile(indexHtml, { hash: arg })
  } else {
    childWindow.loadURL(`${url}/#${arg}`, {
      httpReferrer: ''
    })
    // childWindow.webContents.openDevTools({ mode: "undocked", activate: true })
  }
})
