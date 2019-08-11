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
/**
 * 关注用户
 */
export const followUser = userId => {
  return request({
    method: 'POST',
    url: '/app/v1_0/user/followings',
    data: {
      target: userId
    }
  })
}

/**
* 取消关注
*/
export const unFollowUser = userId => {
  return request({
    method: 'DELETE',
    url: `/app/v1_0/user/followings/${userId}`
  })
}
/**
 * 获取自己基本信息
 */
export const getCurrentUserInfo = () => {
  return request({
    method: 'GET',
    url: `/app/v1_0/user`
  })
}
/**
 * 获取当前登录用户的基本信息
 */
export const getCurrentUserProfile = () => {
  return request({
    method: 'GET',
    url: `/app/v1_0/user/profile`
  })
}
/**
 * 更新用户个人信息
 * axios 会把无效数据进行过滤，null、undefined 等数据
 */
export const updateUserProfile = ({
  name,
  photo,
  gender,
  birthday,
  realName,
  idNumber,
  idCardFront,
  idCardBack,
  idCardHandheld,
  intro
}) => {
  return request({
    method: 'PATCH',
    url: `/app/v1_0/user/profile`,
    data: {
      name,
      photo,
      gender,
      birthday,
      real_name: realName,
      id_number: idNumber,
      id_card_front: idCardFront,
      id_card_back: idCardBack,
      id_card_handheld: idCardHandheld,
      intro
    }
  })
}
/* eslint-disable */
// 更新用户头像
// photo	file	否		头像
// id_card_front	file	否		身份证正面照片
// id_card_back	file	否		身份证背面照片
// id_card_handheld	file	否		手持身份证照片
export const updateUserPhoto = (name, file) => {
  const formData = new FormData()
  formData.append(name, file)
  return request({
    method: 'PATCH',
    url: `/app/v1_0/user/photo`,
    data: formData
  })
}
