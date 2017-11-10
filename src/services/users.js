import { request, ConfigManager } from '../utils'
const config = ConfigManager.getInstance().config
const { api } = config
const { users } = api

export async function query (params) {
  return request({
    url: users,
    method: 'get',
    data: params,
  })
}

export async function create (params) {
  return request({
    url: users,
    method: 'post',
    data: params,
  })
}

export async function remove (params) {
  return request({
    url: users,
    method: 'delete',
    data: params,
  })
}

export async function update (params) {
  return request({
    url: users + "/" + params.id ,
    method: 'put',
    data: params,
  })
}

export async function queryRecords(params) {
  return request({
    url: users + "/" + params.id + "/records",
    method: 'get',
  })
}

export async function saveRecords(params){
  return request({
    url: users + "/" + params.id + "/records",
    method: 'post',
    data: params,
  })
}

export async function updatePassword(params){
  return request({
    url: users + "/" + params.id + "/password",
    method: 'put',
    data: params,
  })
}
