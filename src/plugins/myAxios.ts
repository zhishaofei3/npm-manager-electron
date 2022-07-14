import axios from 'axios'
import config from 'src/service/config'

const USE_DATA_TYPES = ['put', 'post', 'patch']
const PARAMS = 'params'
const DATA = 'data'

axios.defaults.withCredentials = true
const myAxios: any = axios.create({
  baseURL: '',
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json;charset=UTF-8',
    'X-Requested-With': 'XMLHttpRequest',
  }
})

// 处理 request
myAxios.interceptors.request.use(
  (config: any) => {
    config.withCredentials = true

    const type = USE_DATA_TYPES.indexOf(config.method) === -1 ? PARAMS : DATA
    if(config.headers['Content-Type'] !== 'multipart/form-data;' ){ // 非文件上传
      config[type] = Object.assign({}, config[type])
    }
    return config
  },
  (err: any) => {
    console.log(err)
  }
)

// 返回数据处理
myAxios.interceptors.response.use(
  (response: any) => {
    const res = response.data
    if (res.code === 0) {
      return res.data
    } else if (res.code === '999999') {
      console.log('zsf 未登录')
      // location.href = `${config.login}?ReturnUrl=${location.href}`
      // return Promise.reject(new Error('Warning'))
      // window.location.href = config.pageLogin + '&returnUrl=' + decodeURIComponent(window.location.href);
    } else {
      // message.error(res.message || 'Error')
      return Promise.reject(new Error(res.message || 'Warning'))
    }
  },
  (err: any) => {
    // message.error(err.message || 'Error')
    return Promise.reject(err)
  }
);

export default myAxios
