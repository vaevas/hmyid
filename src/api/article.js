import request from '@/utils/request.js'
/**
 * 获取首页频道文章列表
 */
export const getArticles = ({
  /* eslint-disable */
  channel_id,
  timestamp,
  with_top = 1
  /* eslint-disable */
}) => {
  return request({
    method: 'GET',
    url: '/app/v1_1/articles',
    params: {
      channel_id, // 频道ID
      timestamp, // 时间戳整数
      with_top // 0 或1 是否包含置顶
    }
  })
}

//文章不喜欢
export const dislikesArticle = (articleId) => {
  return request({
    method: 'POST',
    url: '/app/v1_0/article/dislikes',
    data: {
      target: articleId
    }
  })
}
//举报文章
export const reportArticle = ({ target, type, remark = '' }) => {
  return request({
    method: 'POST',
    url: '/app/v1_0/article/reports',
    data: {
      target,
      type,
      remark
    }
  })
}
/**
 * 获取所有频道数据
 */
export const getAllChannels = () => {
  return request({
    method: 'GET',
    url: '/app/v1_0/channels'
  })
}
//添加频道
export const resetUserChannels = channels => {
  return request({
      method: 'PUT',
      url: `/app/v1_0/user/channels`,
      data: {
          channels
      }
  })
}
/**
 * 删除用户指定频道
 */
export const deleUserChannel = (ID) => {
  return request({
    method: 'DELETE',
    url: `/app/v1_0/user/channels/${ID}`
  })
}
/**
 * 文章详情
 */
export const getArticleDetail = articleId => {
  return request({
      method: 'GET',
      url: `/app/v1_0/articles/${articleId}`
  })
}