import Base from './base/index'

class Aio {
  versionNumber: string
  get version(){
    return this.versionNumber || 'v0.0.1'
  }
  set version(v: string) {
    this.versionNumber = v
  }
  get base(){
    return Base()
  }
}

const AIO = new Aio()

declare global {
  interface Window { aio: any; }
}

window.aio = AIO || {};
export default Aio
