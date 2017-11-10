import { request, ConfigManager } from '../utils'
const config = ConfigManager.getInstance().config
const { api } = config
const { feedback } = api

export async function create (params) {
  return request({
    url: feedback,
    method: 'post',
    data: params,
  })
}
