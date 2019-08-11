import request from '@/utils/request.js'
// 评论列表
export const getComments = ({
  istype,
  source,
  offset = null,
  limit = 10
}) => {
  return request({
    method: 'get',
    url: `/app/v1_0/comments`,
    params: {
      type: istype ? 'a' : 'c',
      source,
      offset,
      limit
    }
  })
}
/* eslint-disable */
/**
 * 添加评论 || 添加回复
 *
 * target	integer	必须		评论的目标id（评论文章即为文章id，对评论进行回复则为评论id）
 * content	string	必须		评论内容
 * art_id	integer	非必须		文章id，对评论内容发表回复时，需要传递此参数，表明所属文章id。对文章进行评论，不要传此参数。
 */

export const addCommentOrReply = ({ target, content = '', art_id }) => {
  return request({
    method: 'POST',
    url: `/app/v1_0/comments`,
    data: {
      target, // 发布评论->文章id 发表回复->评论id
      content,
      art_id // 发布评论->不需要传  发布回复->文章id
    }
  })
}
