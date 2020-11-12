import Base from './base/index.js'
import Message from './message/index.js'

class Aio {
  get version(){
    return 'v0.0.1'
  }

  get base(){
    return Base()
  }

  get message(){
    return Message()
  }
}

const AIO = new Aio()
window.aio = AIO || {};
export default AIO
