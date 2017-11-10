import { request, ConfigManager } from '../utils'
const config = ConfigManager.getInstance().config
const { api } = config
const { questions,users } = api

export async function queryByID(params) {
  return request({
    url: questions + "/" + params.id ,
    method: 'get',
  })
}

export async function query (params) {
  return request({
    url: questions,
    method: 'get',
    data: params,
  })
}

//请求用户是否收藏题目
export async function queryFavoritesStatusByUserID(params) {
  return request({
    url: questions + "/" + params.id + "/favorites/" + params.userid ,
    method: 'get',
  })
}


export async function queryUserFavorites(params){
  return request({
    url:users + "/" + params.user_id + "/favorites",
    method:'get',
    data: params,
  })
}

export async function queryUserWrong(params){
  return request({
    url:users + "/" + params.user_id + "/wrong",
    method:'get',
    data: params,
  })
}

export async function create (params) {
  return request({
    url: questions,
    method: 'post',
    data: params,
  })
}

export async function remove (params) {
  return request({
    url: questions,
    method: 'delete',
    data: params,
  })
}

export async function update (params) {
  return request({
    url: questions,
    method: 'put',
    data: params,
  })
}

export async function addFavorites (params) {
  return request({
    url: questions + "/" + params.id + "/favorites",
    method: 'post',
  })
}

export async function removeFavorites (params) {
  return request({
    url: questions + "/" + params.id + "/favorites",
    method: 'delete',
  })
}
