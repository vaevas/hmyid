<template>
  <div class="article">
    <!-- 导航 -->
    <van-nav-bar title="黑马头条" left-text="返回" left-arrow @click-left="$router.back()"></van-nav-bar>
    <div>
      <!-- 文章标题 -->
      <h2 class="article-title">{{articleData.title}}</h2>
      <!-- 作者信息 -->
      <auth-info :authinfo="articleData"></auth-info>
      <!-- 文章内容 -->
      <div class="article-content" v-html="articleData.content">

      </div>
      <!-- 更多操作 -->
      <more-action></more-action>
      <!-- 评论列表 -->
      <comment-list :source="articleId" class="comment-list" :istype="true"></comment-list>
        <!-- 回复列表 -->
      <reply-list :istype="false" :articleId="articleId"></reply-list>
      <!-- 回复评论 -->
      <add-comment class="add-comment" :target="articleId"></add-comment>
    </div>
  </div>
</template>

<script>
import AuthInfo from './components/auth-info.vue'
import MoreAction from './components/more-action.vue'
import CommentList from './components/commet-list.vue'
import ReplyList from './components/reply-list.vue'
import AddComment from './components/addcommets.vue'
import { getArticleDetail } from '@/api/article.js'
export default {
  name: 'ArticleIndex',
  components: {
    AuthInfo,
    MoreAction,
    CommentList,
    ReplyList,
    AddComment
  },
  data () {
    return {
      articleData: {}
    }
  },
  computed: {
    articleId () {
      return this.$route.params.articleId
    }
  },
  created () {
    this.articleList()
  },
  methods: {
    async articleList () {
      const data = await getArticleDetail(this.articleId)
      // console.log(data)
      this.articleData = data
    }
  }
}
</script>

<style lang="less" scoped>
.article {
  // padding: 20px;
  .article-title {
    font-size: 40px;
    font-weight: 400px;
  }
  .article-content {
    font-size: 20px;
  }
}
.add-comment{
  position: fixed;
  bottom: 0;
  left: 0;
  z-index: 9999
}
.comment-list{
  margin-bottom: 120px
}
</style>
