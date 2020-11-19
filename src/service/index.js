import Network from '../network'
import Options from '../options'
import Messages from '../message'
import Pages from '../pages'
// import Http from '../http'


class Service {
  get settings(){
    return Options()
  }

  get axios(){
    return Network(this)
  }

  get message(){
    return Messages()
  }

  get pages(){
    return Pages(this)
  }

  // get http(){
  //   return Http(this)
  // }
}

export default Service