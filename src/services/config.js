import { request, ConfigManager } from '../utils'

export function requestConfig (data) {
  return request({
    url: "/client/config",
    method: 'get',
  })
}
