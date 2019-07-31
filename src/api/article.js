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
