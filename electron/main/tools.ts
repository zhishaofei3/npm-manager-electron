const spawn = require('cross-spawn');

export default class Tools {

	/**
	 * 构造函数
	 * */
	constructor () {
	}

	addUser () {
		// npm owner add chenyonghao9 @jd/b2p-b-warehouse-sdk-v2
		const params = [
			'owner',
			'add',
			'ext.yangze6',
			'@jd/b2p-b-warehouse-sdk-v2',
		]

		this.startChildProcess('npm', params)
	}

	/**
	 * 开启子进程
	 * @param {String} command  命令 (git/node...)
	 * @param {Array} params 参数
	 * */
	startChildProcess (command, params) {
		return new Promise((resolve, reject) => {
			var process = spawn(command, params, {
				stdio: 'pipe'
			})

			console.log('zsf @1', process)
			var logMessage = `${command} ${params[0]}`
			var cmdMessage = ''

			process.stdout.on('data', (data) => {
				console.log('zsf @2')
				console.log(`${logMessage} start ---`, data)
				if (!data) {
					reject(`${logMessage} error1 : ${data}`)
				} else {
					cmdMessage = data.toString()
				}
			})

			process.on('close', (data, e1, e2, e3) => {
				console.log('zsf @3')
				console.log(`${logMessage} close ---`, data)
				if (data) {
					reject(`${logMessage} error2 ! ${data}`)
				} else {
					console.log(`${logMessage} success !`)
					resolve(cmdMessage)
				}
			})
		})
	}
}