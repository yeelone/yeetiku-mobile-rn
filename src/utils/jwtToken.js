import axios from 'axios'
import storage from './storage'

export function setAuthorizationToken(token) {
  if (token) {
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`
  } else {
    delete axios.defaults.headers.common['Authorization']
  }
}

export function getToken(){
   return storage.load({
      key: 'jwtToken',
      autoSync: true,
      syncInBackground: true,
      })
}

export function saveToken(token){
  storage.save({
    key: 'jwtToken',
    data: token,
    // expires: 1000 * 3600
  })
}

export function saveUser(user){
    storage.save({
      key:'user',
      data: user,
    })
}

export function getLoginStatus(status){
  return storage.load({
     key: 'loginStatus',
     autoSync: true,
     syncInBackground: true,
  })
}

export function saveLoginStatus(status){
    storage.save({
      key:'loginStatus',
      data: status
    })
}

export function getUser(){
   return storage.load({
      key: 'user',
      autoSync: true,
      syncInBackground: true,
    })
}

export  function removeUser(){
  storage.remove({
  	key: 'user'
  })
}

export  function removeToken(){
  storage.remove({
  	key: 'jwtToken'
  })
}
