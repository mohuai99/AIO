import axios from "axios"
import http from '../http/index' 

const getBaseUrl = (baseUrls, env) => {
  return baseUrls[env] || '/'
}
export default function (service) {
  const {settings, message} = service
  const {axiosConfig, baseUrls, env} = settings
  axiosConfig.baseURL = getBaseUrl(baseUrls, env)
  const instance = axios.create(axiosConfig)
  http(instance, message)

  return instance
}
