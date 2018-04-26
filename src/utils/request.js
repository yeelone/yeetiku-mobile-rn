import axios from 'axios'
import qs from 'qs'
import isEmpty  from 'lodash.isempty'
import { getToken , removeToken} from './jwtToken'

import ConfigManager from './config'
const config = ConfigManager.getInstance().config

//这里再添加一个设置函数
let http = axios.create({
  // baseURL: config.baseURL + config.apiPrefix,
  timeout: 1000,
  headers: {
    'Accept': 'application/json',
    'Content-Type': 'application/json',
  }
})

let errorCallback = () =>{}
let successCallback = () =>{}

function setHttpToken() {
  return getToken().then((token)=>{
    if ( token ) {
      http.defaults.headers.common['Authorization'] = 'Bearer ' + token
    }
    http.interceptors.request.use(function (config) {
        if ( token ) {
          http.defaults.headers.common['Authorization'] = 'Bearer ' + token
        }
        return config
      }, function (error) {
        return Promise.reject(error)
      })
  }).catch((error) => {
    removeToken()
  })
}

const fetch = (options) => {
  let {
    method = 'get',
    data,
    fetchType,
    url,
  } = options

  switch (method.toLowerCase()) {
    case 'get':
      return http.get(`${url}${!isEmpty(data) ? `?${qs.stringify(data)}` : ''}`)
    case 'delete':
      return http.delete(url, { data })
    case 'head':
      return http.head(url, data)
    case 'post':
      return http.post(url, data)
    case 'put':
      return http.put(url, data)
    case 'patch':
      return http.patch(url, data)
    default:
      return http(options)
  }
}

//registerErrorCallback : 当请求失失败时，调用错误回调
export function registerErrorCallback(callback){
  errorCallback = callback
}

//registerSuccessCallback : 当请求失成功时，调用成功回调
export function registerSuccessCallback(callback){
  successCallback = callback
}


export function setHttpBaseUrl(domain,apiPrefix){
    http.defaults.baseURL = "http://" + domain + apiPrefix
}

export async function httpInstance(){
  await setHttpToken()
  return http
}

export async function request (options) {
  await setHttpToken()
  return fetch(options).then((response) => {
    const { message, code } = response.data
    let data = response.data
    let status = null 
    if ( code > 10400 ){
       status = { success: false, status:code, message }
    }else {
      status = {
        success: true,
        message,
        status:code,
        ...data,
      }
    }
    
    successCallback(status)

    return status 

  }).catch((error) => {
    console.log("error", error);
    
    const { response } = error
    let message
    let returnStatus = null 
    if (response) {
      const { status, data, statusText } = response
      message = data.message || statusText
      returnStatus = { success: false,status , message }
    } else {
      returnStatus = { success: false, status:600 , message :'Network Error'}
    }
    
    errorCallback(returnStatus)

    return returnStatus
  })
}
