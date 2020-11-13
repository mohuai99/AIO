export default function(){
  let env = {}
  let user = {}
  let lang = {}
  let menu = []

  return {
    getEnv(){
      return Promise.resolve(env)
    },
    getEnvSync(){
      return env
    },
    setEnv(value){
      env = value
    },
    getUser(){
      return Promise.resolve(user)
    },
    getUserSync(){
      return user
    },
    setUser(value){
      user = value
    },
    getLang(){
      return Promise.resolve(lang)
    },
    getLangSync(){
      return lang
    },
    setLang(value){
      lang = value
    },
    getMenu(){
      return Promise.resolve(menu)
    },
    getMenuSync(){
      return menu
    },
    setMenu(value){
      menu = value
    }
  }
}