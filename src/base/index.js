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
    getUser(){
      return Promise.resolve(user)
    },
    getUserSync(){
      return user
    },
    getLang(){
      return Promise.resolve(lang)
    },
    getLangSync(){
      return lang
    },
    getMenu(){
      return Promise.resolve(menu)
    },
    getMenuSync(){
      return menu
    }
  }
}