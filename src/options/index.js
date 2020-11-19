import Common from "../common/index.js";

export default function () {
  return Common.util.settingMap({
    user: {
      valueField: "userId",
      textField: () => {
        return "nameCn" || "nameEn"
      },
    },
    env: 'development',
    baseUrls: {
      production: '/',
      development: '/',
      test: 'http://localhost:3001'
    },
    axiosConfig: {
      // `baseURL` 将自动加在 `url` 前面，除非 `url` 是一个绝对 URL。
      baseURL: '/',
      // `headers` 是即将被发送的自定义请求头
      headers: {'X-Requested-With': 'XMLHttpRequest'},
       // `timeout` 指定请求超时的毫秒数(0 表示无超时时间) 如果请求话费了超过 `timeout` 的时间，请求将被中断
      timeout: 1000,
      // `withCredentials` 表示跨域请求时是否需要使用凭证 默认为 false
      withCredentials: true, 
      // `responseType` 表示服务器响应的数据类型，可以是 'arraybuffer', 'blob', 'document', 'json'(默认), 'text', 'stream'
      responseType: 'json',
    }
  })
}
