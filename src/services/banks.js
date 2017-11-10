import { request, ConfigManager } from '../utils'
const config = ConfigManager.getInstance().config
const { api } = config
const { banks,users } = api

export async function queryByID(params) {
  return request({
    url: banks + "/" + params.id ,
    method: 'get',
  })
}

export async function query (params) {
  return request({
    url: banks,
    method: 'get',
    data: params,
  })
}

export async function status (params) {
  return request({
    url: banks + "/" + params.id + "/status",
    method: 'post',
    data:params
  })
}

export async function queryRecords(params){
  return request({
    url: banks + "/" + params.id + "/records",
    method: 'get',
    data:params
  })
}

export async function queryByUser(params){
  return request({
    url: users + "/" + params.userid  + '/banks',
    method:'get',
    data:params
  })
}

export async function queryByTag(params){
  return request({
    url: "/banktags" + "/" + params.tag  + '/banks',
    method:'get',
    data:params
  })
}

export async function queryAllTags(params){
  return request({
    url: "/banktags",
    method:'get',
    data:params
  })
}


export async function create (params) {
  return request({
    url: banks,
    method: 'post',
    data: params,
  })
}

export async function remove (params) {
  return request({
    url: banks,
    method: 'delete',
    data: params,
  })
}

export async function update (params) {
  return request({
    url: banks  + "/" + params.id ,
    method: 'put',
    data: params,
  })
}

export async function queryRelatedQuestions(params){
  return request({
    url: banks + "/" + params.id + "/questions",
    method: 'get',
    data: params,
  })
}

export async function saveRelatedQuestions(params){
  return request({
    url: banks + "/" + params.id + "/questions",
    method: 'post',
    data: {questions:params.questions}
  })
}
