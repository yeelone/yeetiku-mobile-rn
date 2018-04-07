import data from './config.json'
import storage from './storage'

const api = {
    userLogin: '/auth/login',
    userRegister: '/auth/register',
    userLogout: '/auth/logout',
    userInfo: '/me',
    users: '/users',
    groups: '/groups',
    tags: '/tags',
    dashboard: '/dashboard',
    questions: '/questions',
    categories:'/categories',
    banks:'/banks',
    upload:'/upload',
    feedback:'/feedback',
    comments:'/comments',
}

const defaultSettings = {
  ...data,
  api: {
    ...api
  },
}

export default class ConfigManager {
    static myInstance = null
    config = {
      api:{
        ...api
      }
    }

    constructor(radius) {
      this.getConfig()
    }

    static getInstance() {
        if (this.myInstance == null) {
            this.myInstance = new ConfigManager()
        }
        return this.myInstance
    }

    setConfig(data){
      if (data){
        this.config = {
          ...data,
          baseURL: "http://" + data.domain + data.apiPrefix,
          server: "http://" + data.domain,
          api:{
            ...api
          }
        }
      }else{
         this.config = defaultSettings
      }

      storage.save({
        key: 'settings',
        data: this.config,
      })
    }

    getConfig(){
      return storage.load({
         key: 'settings',
         autoSync: true,
         syncInBackground: true,
       }).then((data) => {
         this.config = data
       }).catch((error)=>{
         this.config = defaultSettings
       })
    }

    setDomain(domain){
      this.config['domain'] = domain
      this.config['baseURL'] = "http://" + domain + this.config['apiPrefix']
      this.config['server'] = "http://" + domain
      this.setConfig(this.config)
    }
}
