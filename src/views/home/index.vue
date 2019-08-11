<template>
  <div class="home-container">
    <van-nav-bar title="首页" fixed >
      <van-icon name="search" slot="right"  @click.native="$router.push({path:'/search'})"/>
    </van-nav-bar>
    <van-tabs
      v-model="active"
      class="channel-tabs"
      animated
      title-active-color="#3296fa"
      color="#3296fa"
      :lazy-render="false"
      @change="changeTab"
    >
      <div slot="nav-right" class="wap-nav" @click="Popup()">
        <van-icon name="wap-nav"></van-icon>
      </div>
      <van-tab :title="item.name" v-for="item in channels" :key="item.id">
        <van-pull-refresh v-model="item.downPullLoading" @refresh="onRefresh" :success-text="hint">
          <van-list
            v-model="item.upPullLoading"
            :finished="item.upPullFinished"
            finished-text="没有更多了"
            @load="onLoad"
          >
            <van-cell
              v-for="item in item.articles"
              :key="item.art_id.toString()"
              :title="item.title"
              @click="$router.push({name:'article',params:{articleId:item.art_id}})"
            >
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
                  <van-icon class="close" name="cross" @click="showMoreActionDia(item)"></van-icon>
                </p>
              </template>
            </van-cell>
          </van-list>
        </van-pull-refresh>
      </van-tab>
    </van-tabs>
    <!-- 更多操作 -->
    <dialog-a v-model="show" :selectedArticles="selectedArticles" @falseDelete="deleteFalse"></dialog-a>
    <!-- 编辑框 -->
    <channles v-model="box" :channels="channels" :active="active" @update:active-index="zctive" @delll="fnn"></channles>
  </div>
</template>

<script>
import { getChannels } from '@/api/channle.js'
import { mapState } from 'vuex'
import { getArticles } from '@/api/article'
import DialogA from './components/dialog.vue'
import channles from './components/channles.vue'
export default {
  name: 'home',
  components: { DialogA, channles },
  data () {
    return {
      active: 0,
      loading: false,
      finished: false,
      isLoading: false,
      channels: [],
      show: false,
      selectedArticles: null,
      hint: '',
      box: false
    }
  },
  created () {
    // 获取频道
    this.loadChannels()
  },
  computed: {
    // 拿到托管给vuex中的token
    ...mapState(['user']),
    // 获取激活频道当前的文章数据
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
    // tab切换触发change事件,因为给tabs设置了lazy-render="false" 需要手动更新
    changeTab () {
      this.onLoad()
    },
    // 得到点击删除触发的方法进行处理
    fnn () {
      if (!this.activeChannles.articles.length) {
        this.activeChannles.upPullLoading = true
        this.onLoad()
      }
    },
    // 接受子组件传过来的值
    zctive (i) {
      this.active = i
    },
    // 弹出编辑框
    Popup () {
      this.box = true
    },
    // 假删除更新视图
    deleteFalse () {
      // 获取文章中被选中的文章然后删除
      // findIndex
      // 1. 这是数组的实例方法
      // 2. 能遍历
      // 3. 传cb
      // 4. cb的形参代表每个元素
      // 5. return 条件
      // 6. findIndex会把符合return条件的元素的索引
      const index = this.activeChannles.articles.findIndex(item => {
        return item === this.selectedArticles
      })
      this.activeChannles.articles.splice(index, 1)
    },
    // 点击叉号将选中的文章传过来,弹出层显示
    showMoreActionDia (selectedArticles) {
      this.selectedArticles = selectedArticles
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
      //   const channelsToken = JSON.parse(window.localStorage.getItem("channels"));
      //   // 有数据
      //   if (channelsToken) {
      //     this.channels = channelsToken;
      //     // 没数据
      //   } else {
      //     const data = await getChannels();
      //     data.channels.forEach(item => {
      //       // id和name
      //       item.downPullLoading = false; // 当前频道下拉状态
      //       item.upPullLoading = false; // 当前频道上拉加载更多
      //       item.upPullFinished = false; // 当前频道加载完毕
      //       item.timestamp = Date.now(); // 为每个频道添加默认时间戳属性
      //       item.articles = []; // 为了控制每个频道自己的文章列表数据
      //     });
      //     this.channels = data.channels;
      //   }
      //   // 登录
      // } else {
      //   const data = await getChannels();
      //   data.channels.forEach(item => {
      //     // id和name
      //     item.downPullLoading = false; // 当前频道下拉状态
      //     item.upPullLoading = false; // 当前频道上拉加载更多
      //     item.upPullFinished = false; // 当前频道加载完毕
      //     item.timestamp = Date.now(); // 为每个频道添加默认时间戳属性
      //     item.articles = []; // 为了控制每个频道自己的文章列表数据
      //   });
      //   this.channels = data.channels;
      // }
      const channelsToken = JSON.parse(window.localStorage.getItem("channels"));
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
      //延迟加载
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
    async onRefresh() {
      await this.$delay(800);
      //用最新的时间戳拿最新的数据
      this.activeChannles.timestamp = Date.now();
      //拿最新的时间戳发送请求
      const data = await this.loadArticles();
      //如果有数据
      if (data.results.length) {
        //将拿到的文章给赋值给文章列表
        this.activeChannles.articles = data.results;
        //更新时间戳
        this.activeChannles.timestamp = data.pre_timestamp;
        //调用onLoad事件保证数据够用
        this.onLoad();
        this.hint = "刷新完成";
      } else {
        this.hint = "无最新文章";
      }
      // 停止动画
      this.activeChannles.downPullLoading = false;

      // setTimeout(() => {
      //   this.$toast("刷新成功");
      //   this.activeChannles.downPullLoading = false;
      //   this.count++;
      // }, 500);
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
  .van-icon {
     color: #ffffff;
  }
}
.home-container /deep/.wap-nav {
  color: #ccc;
  position: fixed;
  right: 0;
  background: #ffffff;
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
