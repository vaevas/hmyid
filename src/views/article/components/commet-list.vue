<template>
  <div>
    <van-list v-model="loading" :finished="finished" finished-text="没有更多了" @load="onLoad">
      <van-cell v-for="item in list" :key="item.aut_id.toString()">
        <div slot="icon">
          <img class="avatar" :src="item.aut_photo" alt />
        </div>
        <div slot="title">
          <span>{{item.aut_name}}</span>
        </div>
        <div slot="default">
          <van-button icon="like-o" size="mini" plain>赞</van-button>
        </div>
        <div slot="label">
          <p>{{item.content}}</p>
          <p>
            <span>{{item.pubdate|relTime}}</span>
            ·
            <span @click="show(item)">回复</span>
          </p>
        </div>
      </van-cell>
    </van-list>
  </div>
</template>

<script>
import { getComments } from '@/api/comment.js'
import eventbus from '@/utils/eventbus.js'
export default {
  name: 'CommentList',
  props: {
    source: {
      type: [Number, String],
      required: true
    },

    /**
     * 你是要加载文章的评论呢？还是要加载评论的回复
     */
    istype: {
      type: Boolean

    }
  },
  data () {
    return {
      list: [],
      loading: false,
      finished: false,
      offset: null
    }
  },
  created () {},
  computed: {
    articleId () {
      return this.$route.params.articleId
    }
  },
  methods: {
    show (item) {
      eventbus.$emit('reply-show', item)
    },
    async onLoad () {
      // // console.log(this.articleId.c[0], this.articleId.c[1])
      // const s = this.articleId.c[0].toString() + this.articleId.c[1]
      // console.log(s)
      const data = await getComments({
        istype: this.istype,
        source: 141314, // this.source.toString(),
        offset: this.offset
      })
      // console.log(data)
      if (data.results.length) {
        this.list.push(...data.results)
        // 修改页码->偏移量
        this.offset = data.last_id
        // 停止每次加载完毕的动画
        this.loading = false
      } else {
        this.loading = false
        this.finished = true
      }

      // console.log('onLoad')
      // // 异步更新数据
      // setTimeout(() => {
      //   for (let i = 0; i < 5; i++) {
      //     this.list.push(this.list.length + 1)
      //   }
      //   // 加载状态结束
      //   this.loading = false

      //   // 数据全部加载完成
      //   if (this.list.length >= 10) {
      //     this.finished = true
      //   }
      // }, 500)
    }
  }
}
</script>

<style lang="less" scoped>
.avatar {
  width: 50px;
  height: 50px;
  border-radius: 100%;
  margin-right: 10px;
}
</style>
