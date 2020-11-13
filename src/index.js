import Base from './base/index.js'
import Message from './message/index.js'
import Http from './http/index.js'
import Common from './common/index.js'
import Service from './service/index.js'

class Aio {
  get version(){
    return 'v0.0.1'
  }

  get base(){
    return Base()
  }

  get common(){
    return Common
  }

  get http(){
    return Http()
  }

  get message(){
    return Message()
  }

  get service(){
    return Service()
  }
}

const AIO = new Aio()
window.aio = AIO || {}
export default AIO
