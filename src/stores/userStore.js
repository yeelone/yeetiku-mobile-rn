/* @flow */

// import axios from 'axios'
import { observable ,action } from 'mobx'
import { requestLogin,requestRegister } from '../services/login'
import { httpInstance,ConfigManager,setHttpBaseUrl } from '../utils'
import { saveToken,getToken,saveUser,removeUser,removeToken,getUser,saveLoginStatus } from '../utils/jwtToken'
import { update,updatePassword } from '../services/users'

export default class UserStore {
  @observable id: number = 0
  @observable domain: string = ""
  @observable user: object = {}
  @observable username: string = ''
  @observable email: string = ''
  @observable password: string = ''
  @observable rememberPassword: boolean = true
  @observable isLoading: boolean = false
  @observable isLoginedIn: boolean = false
  @observable token: string = ''
  @observable loading = false
  @observable loadResult = false
  @observable resultMessage = ""
  @observable done = false
  @observable progress = 0

  @action login = async (callback) => {
    callback = callback || ( () => {} )
    let cfg = ConfigManager.getInstance()
    const domain = this.domain || cfg.config.domain
    //
    cfg.setDomain(domain)
    setHttpBaseUrl(domain, cfg.config.apiPrefix)
    this.loading = true
    return requestLogin({email:this.email, password:this.password}).then(action( (res)=>{
      if ( res.success && res.code === 10200  ) {
          saveToken(res.token)
          let user = {domain:this.domain, ...res.body.user}
          if ( this.rememberPassword ) {
            user['password'] = this.password
          }else{
            user['password'] = ""
          }
          saveUser(user)
          saveLoginStatus({isLoginedIn: true,user,domain:this.domain})
          this.id = res.body.id
          this.user = res.body.user
          this.token = res.token
          this.isLoginedIn = true
      }else if ( res.status === 600 ){
        this.isLoginedIn = false
        alert("连接不上服务器，能连接上服务器吗？")
      }else if ( res.status === 10401 ){
        this.isLoginedIn = false
        alert("用户名或密码错误，请重新输入...")
      }
      callback()
      this.loading = false
    }) ).catch((error) => {
      alert("连接不上服务器，请稍候重试！" + error)
      this.loading = false
    })
  }

  @action resetLoadResult = () => {
    this.loadResult = false
    this.resultMessage = ""
  }

  @action setGuestUser = (email, password) =>{
    this.email = email
    this.password = password
  }

  @action setLoginedUser = (user) => {
    this.id = user.id
    this.user = user
    this.email = user.email
    this.password = user.password
    this.isLoginedIn = true
  }

  @action setDomain = (domain) => {
      this.domain = domain
  }

  @action registerNewUser= (data,callback) => {
    this.loading = true
    callback = callback || ( () => {} )
    return requestRegister(data).then(action( (res)=>{
      if ( res.success && res.code === 10200  ) {
          callback()
      }else{
        alert("连接不上服务器，请稍候重试！")
      }

      this.loading = false
    }) )
  }

  @action logout = () => {
    this.action = ""
    this.isLoginedIn = false
    removeToken()
    saveLoginStatus({isLoginedIn: false,user:this.user,domain:this.domain})
    // removeUser()
  }

  @action saveAvatar = async (userid, image_uri) => {
    let http = await httpInstance()
    let config = ConfigManager.getInstance().config
    let data = new FormData()
    data.append('picture', {uri: image_uri, type: 'multipart/form-data',name:'avatar.jpg'})
    const httpconfig = {
      headers: { 'Content-Type': 'multipart/form-data' } ,
      onUploadProgress: (progressEvent) => {
        let percentCompleted = Math.floor((progressEvent.loaded * 100) / progressEvent.total)

        if ( percentCompleted % 20 === 0  ) {
          this.progress = percentCompleted
        }
      }
    }
    this.loading = true
    http.put(config.api.users + "/" + userid + "/avatar", data,httpconfig).then(action((res) => {
      const body = res.data.body
      this.loading = false
      this.user.avatar = body.url
    })).catch((error) => {
      this.loading = false
    })
  }

  @action update = (key,value) => {
      let user = this.user
      user[key] = value

      this.loading = true
      this.loadResult = false
      
      update(user).then(action( (res)=>{
        if ( res.success && res.code === 10200  ) {
          this.loadResult = true
        }else{
          this.loadResult = false
          this.resultMessage = res.body.message
        }
          this.loading = false
      }) )
  }

  @action changePassword = (oldpassword,newpassword) => {
      const data = {
        id : this.id ,
        oldpassword,
        newpassword
      }
      this.loading = true
      this.loadResult = false
      updatePassword(data).then(action((res)=>{
        if ( res.success && res.code === 10200  ) {
          this.loadResult = true
        }else{
          this.loadResult = false
          this.resultMessage = res.body.message
        }

        this.loading = false
      }))
  }

  getAvatar = () => {
    const config = ConfigManager.getInstance().config
    const avatar = this.user.avatar
    return config.server + avatar
  }
}
