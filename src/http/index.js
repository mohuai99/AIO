
export default function(instance, message){
  // const {axios, message} = service
  let loadingCount = 0

  instance.interceptors.request.use((config) => {
    // 在这里添加loading
   loadingCount++
   if(loadingCount === 1){
    message.publish('aio_page_showLoading')
   }
    
    return config;
  }, err => Promise.reject(err))

  instance.interceptors.response.use((response) => {
    // 在这里移除loading
    loadingCount--
    if(loadingCount === 0){
      setTimeout(()=>{
        message.publish('aio_page_closeLoading')
      }, 2000)
    }

    // todo: 想根据业务需要，对响应结果预先处理的，都放在这里1
    return response;
  }, (err) => {
    if (err.response) { // 响应错误码处理
      switch (err.response.status) {
        case '403':
          // todo: handler server forbidden error
          break;
          // todo: handler other status code
        default:
          break;
      }
      return Promise.reject(err.response)
    }
    if (!window.navigator.online) { // 断网处理
      // todo: jump to offline page
      return -1;
    }
    return Promise.reject(err)
  })

}