import { request, ConfigManager } from '../utils'
const config = ConfigManager.getInstance().config
const { api } = config
const { exams,users } = api


export async function queryByID(params) {
    return request({
      url: exams + "/" + params.id ,
      method: 'get',
    })
  }

export async function create(params) {
    return request({
      url: exams,
      method: 'post',
      data: params,
    })
}

export async function queryByUser(params){
    return request({
      url: users + "/" + params.userid  + '/exams',
      method:'get',
      data:params
    })
  }

export async function updateScore(params) {
    return request({
      url: exams,
      method: '',
      data: params,
    })
}