<template>
    <van-popup v-model="isShow" position="bottom" :style="{height:'75%'}">
    <van-cell>
      <div slot="icon">
        <img class="avatar" :src="commentFirst.aut_photo" alt="">
      </div>
      <div slot="title">
        <span>{{commentFirst.aut_name}}</span>
        <van-tag>楼主</van-tag>
      </div>
      <div slot="default">
        <van-button icon="like-o" size="mini" plain>赞</van-button>
      </div>
      <div slot="label">
        <p>{{commentFirst.content}}</p>
        <p>
          <span>{{commentFirst.pubdate | relTime}}</span>
        </p>
      </div>
    </van-cell>
    <hr>
    <!-- 回复 -->
  <comment-list :source="commentFirst.com_id.toString()" :istype="false"></comment-list>
  <!-- 回复框 -->
  <add-comment class="add-comment" :target="commentFirst.com_id.toString()" :art_id="articleIdl"></add-comment>
  </van-popup>
</template>

<script>
import eventbus from '@/utils/eventbus.js'
import CommentList from './commet-list.vue'
import AddComment from './addcommets.vue'

export default {
  name: 'ReplyList',
  components: {
    CommentList,
    AddComment
  },
  props: {
    // articleId: {
    //   type: [Number, String]
    // }
  },
  data () {
    return {
      isShow: false,
      commentFirst: {
        com_id: ''
      }
    }
  },
  computed: {
    articleIdl () {
      return this.$route.params.articleId
    }
  },
  created () {
    eventbus.$on('reply-show', (item) => {
      this.isShow = true
      this.commentFirst = item
    })
  }
}
</script>

<style lang='less' scoped>
.avatar {
  width: 50px;
  height: 50px;
  border-radius: 100%;
  margin-right: 10px;
}
.add-comment{
  position: fixed;
  bottom: 0;
  left: 0;
}
</style>
