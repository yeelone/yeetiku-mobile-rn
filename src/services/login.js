import { request, ConfigManager } from '../utils'

const config = ConfigManager.getInstance().config
const { api } = config
const { userLogin ,userRegister} = api

export function requestLogin (data) {
  return request({
    url: userLogin,
    method: 'post',
    data,
  })
}

export function requestRegister (data) {
  return request({
    url: userRegister,
    method: 'post',
    data,
  })
}
