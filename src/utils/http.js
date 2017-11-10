import axios from 'axios'
import qs from 'qs'
import { baseURL } from './config'
import isEmpty  from 'lodash.isempty'
import { getToken } from './jwtToken'

const http = axios.create({
  baseURL: baseURL,
  timeout: 1000,
  headers: {
    'Accept': 'application/json',
    'Content-Type': 'application/json',
  }
})

function setHttpToken() {
  return getToken().then((token)=>{
    if ( token ) {
      http.defaults.headers.common['Authorization'] = 'Bearer ' + token
    }

    http.interceptors.request.use(function (config) {
        // Do something before request is sent
        if ( token ) {
          http.defaults.headers.common['Authorization'] = 'Bearer ' + token
        }

        return config
      }, function (error) {
        // Do something with request error
        return Promise.reject(error)
      })
  }).catch((error) => {
    console.log('token is expired!')
  })
}

export default async function httpInstance(){
  await setHttpToken()
  return http
}
