import { request, ConfigManager } from '../utils'
const config = ConfigManager.getInstance().config
const { api } = config
const { questions,users,comments } = api

export async function queryByID(params) {
  return request({
    url: questions + '/' + params.id ,
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
    url: questions + '/' + params.id + '/favorites/' + params.user_id ,
    method: 'get',
  })
}

export async function queryComments (params) {
  return request({
    url: questions + '/' + params.id + '/comments',
    method: 'get',
    data: params,
  })
}

export async function queryChildComments (params) {
  return request({
    url: comments + '/parent/' + params.id ,
    method: 'get',
    data: params,
  })
}

export async function userLikeComment (params) {
  return request({
    url: comments + '/' + params.id + '/users/' +params.user_id + '/like',
    method: 'put',
  })
}

export async function userDislikeComment (params) {
  return request({
    url:comments + '/' + params.id + '/users/' +params.user_id + '/dislike',
    method: 'put',
  })
}

export async function createComments (params) {
  return request({
    url: comments,
    method: 'post',
    data: params,
  })
}

export async function queryUserFavorites(params){
  return request({
    url:users + '/' + params.user_id + '/favorites',
    method:'get',
    data: params,
  })
}

export async function queryUserWrong(params){
  return request({
    url:users + '/' + params.user_id + '/wrong',
    method:'get',
    data: params,
  })
}

export async function addFavorites (params) {
  return request({
    url: questions + '/' + params.id + '/favorites',
    method: 'post',
  })
}

export async function removeFavorites (params) {
  return request({
    url: questions + '/' + params.id + '/favorites',
    method: 'delete',
  })
}
