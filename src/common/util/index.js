export default function(){
  return {
    hasOwnProperty(obj, key){
      return Object.prototype.hasOwnProperty.call(obj, key)
    },
    settingMap(settings){
      for(const key in settings){
        if(this.hasOwnProperty(settings, key)){
          let prop = settings[key]
          if(typeof prop === 'string' || typeof prop === 'function'){
            Object.defineProperty(settings, key, {
              get(){
                return typeof prop === 'function' ? prop() : prop
              },
              set(value){
                prop = value
              },
              enumerable: true,
              configurable: true
            })
          } else {
            settings[key] = this.settingMap(prop)
          }
        }
      }
      return settings
    }
  }
}