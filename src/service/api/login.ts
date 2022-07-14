import myAxios from "@/plugins/myAxios"
import to from 'await-to-js'
import myEnv from "@/service/config"

// // 获取滑块sessionId
// export const getJDCloudSlideSessionID: any = async (rawParams: any) => {
//   const params: any = {
//     ...rawParams
//   }
//   const url = myEnv.baseUrl + '/jnos.account.captcha.getSessionId'
//   return await to(myAxios.post(url, params))
// }
