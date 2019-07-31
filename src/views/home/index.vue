<template>
  <div class="home-container">
    <van-nav-bar title="首页|搜索" fixed />
    <van-tabs
      v-model="active"
      class="channel-tabs"
      animated
      title-active-color="#3296fa"
      color="#3296fa"
    >
      <van-tab :title="item.name" v-for="item in channels" :key="item.id">
        <van-pull-refresh v-model="item.downPullLoading" @refresh="onRefresh">
          <van-list
            v-model="item.upPullLoading"
            :finished="item.upPullFinished"
            finished-text="没有更多了"
            @load="onLoad"
          >
            <van-cell v-for="item in item.articles" :key="item.art_id" :title="item.title">
              <template slot="label">
                <van-grid :border="false" :column-num="3" v-show="item.cover.type!==0">
                  <van-grid-item v-for="item in item.cover.images" :key="item">
                    <!-- lazy-load属性图片懒加载 -->
                    <van-image :src="item" lazy-load />
                  </van-grid-item>
                </van-grid>
                <p>
                  <span>作者:{{item.aut_name}}</span>
                  &nbsp; &nbsp;
                  <span>评论 :{{item.comm_count}}</span>
                  &nbsp; &nbsp;
                  <span>时间:{{item.pubdate | relTime}}</span>
                  &nbsp; &nbsp;
                  <van-icon class="close" name="cross" @click="showMoreActionDia()"></van-icon>
                </p>
              </template>
            </van-cell>
          </van-list>
        </van-pull-refresh>
      </van-tab>
    </van-tabs>
    <dialog-a v-model="show"></dialog-a>
  </div>
</template>

<script>
import { getChannels } from '@/api/channle.js'
import { mapState } from 'vuex'
import { getArticles } from '@/api/article'
import DialogA from './components/dialog.vue'
export default {
  name: 'home',
  components: { DialogA },
  data () {
    return {
      active: 0,
      loading: false,
      finished: false,
      isLoading: false,
      channels: [],
      show: false
    }
  },
  created () {
    this.loadChannels()
  },
  computed: {
    ...mapState(['user']),
    activeChannles () {
      return this.channels[this.active]
    }
  },
  watch: {
    // 检测token值
    '$store.state.user' () {
      // 因为有缓存 所以频道不会自己获取
      // 手动更新频道
      this.loadChannels()
      // 开启动画
      this.activeChannles.upPullLoading = true
      // 获取文章
      this.loadArticles()
    }
  },
  methods: {
    showMoreActionDia () {
      this.show = true
    },
    // 获取文章列表数据
    async loadArticles () {
      /* eslint-disable */
      const { id: channel_id, timestamp } = this.activeChannles;
      /* eslint-disable */
      const data = await getArticles({
        channel_id,
        timestamp,
        with_top: 1
      });
      return data;
    },
    async fn() {
      const data = await getChannels();
      data.channels.forEach(item => {
        // id和name
        item.downPullLoading = false; // 当前频道下拉状态
        item.upPullLoading = false; // 当前频道上拉加载更多
        item.upPullFinished = false; // 当前频道加载完毕
        item.timestamp = Date.now(); // 为每个频道添加默认时间戳属性
        item.articles = []; // 为了控制每个频道自己的文章列表数据
      });
      this.channels = data.channels;
    },
    // 频道列表
    async loadChannels() {
      // try {
      //   const data = await getChannels()
      //   // data->{channels:[{},{}]}
      //   this.channels = data.channels
      // } catch (error) {
      //   console.dir(error)
      // }
      // 未登录
      // if (!this.user) {
      //   const channelsToken = window.localStorage.getItem('channels')
      //   // 有数据
      //   if (channelsToken) {
      //     this.channels = channelsToken
      //     // 没数据
      //   } else {
      //     const data = await getChannels()
      //     this.channels = data.channels
      //   }
      //   // 登录
      // } else {
      //   const data = await getChannels()
      //   this.channels = data.channels
      // }
      const channelsToken = window.localStorage.getItem("channels");
      this.user || (!this.user && !channelsToken)
        ? this.fn()
        : (this.channels = channelsToken);
    },
    // 滚动数据显示
    async onLoad() {
      // 异步更新数据
      // setTimeout(() => {
      //   for (let i = 0; i < 10; i++) {
      //     this.list.push(this.list.length + 1)
      //   }
      //   // 加载状态结束
      //   this.loading = false

      //   // 数据全部加载完成
      //   if (this.list.length >= 40) {
      //     this.finished = true
      //   }
      // }, 500)
      await this.$delay(800);
      let data = [];
      //第一次发送请求获取历史时间戳
      data = await this.loadArticles();
      // console.log(data);
      if (data.pre_timestamp && data.results.length === 0) {
        //将历史时间戳拿出
        this.activeChannles.timestamp = data.pre_timestamp;
        //用历史时间戳再发一次请求
        data = await this.loadArticles();
        // console.log(data)
      }
      // 当没有时间戳和没有数据时,取消动画 显示已加载完毕
      if (!data.pre_timestamp && !data.results.length) {
        this.activeChannles.upPullLoading = false;
        this.activeChannles.upPullFinished = true;
        return;
      }
      // 更新时间戳
      this.activeChannles.timestamp = data.pre_timestamp;
      //将data中的文章添加到activeChannles的文章中
      this.activeChannles.articles.push(...data.results);
      //停止动画
      this.activeChannles.upPullLoading = false;
    },
    // 下拉刷新
    onRefresh() {
      setTimeout(() => {
        this.$toast("刷新成功");
        this.activeChannles.downPullLoading = false;
        this.count++;
      }, 500);
    }
  }
};
</script>

<style scoped lang='less'>
.home-container .van-nav-bar {
  background-color: #1989fa;
  .van-nav-bar__title {
    color: #ffffff;
  }
}
.channel-tabs {
  margin-bottom: 100px;
  /deep/.van-tabs__wrap {
    position: fixed;
    top: 92px;
    z-index: 2;
    width: 100%;
  }
  /deep/ .van-tabs__content {
    margin-top: 184px;
  }
}
</style>
