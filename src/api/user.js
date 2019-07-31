// 登录api
import request from '@/utils/request.js'
export const logining = ({ mobile, code }) => {
  return request({
    method: 'POST',
    url: `/app/v1_0/authorizations`,
    data: {
      mobile,
      code
    }
  })
}
