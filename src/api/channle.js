// 频道api
import request from '@/utils/request.js'
export const getChannels = () => {
  return request({
    method: 'get',
    url: `/app/v1_0/user/channels`
  })
}
