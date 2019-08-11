 <template>
  <div class="channles-container">
    <van-popup :value="value" @input="$emit('input')" position="top" :style="{ height: '80%' }">
      <div class="channel">
        <div class="channel-head">
          <div>
            <span class="title">我的频道</span>
            <span class="desc">点击进入频道</span>
          </div>
          <div>
            <van-button
              type="danger"
              plain
              size="mini"
              @click="isEdit=!isEdit"
            >{{!isEdit?'编辑':'完成'}}</van-button>
          </div>
        </div>
        <van-grid class="channel-content" :gutter="10" clickable>
          <van-grid-item
            v-for="(item,index) in channels"
            :key="item.id"
            :class="{active:index===active&&!isEdit}"
            @click="clickChannel(item,index)"
          >
            <span class="text">{{item.name}}</span>
            <van-icon class="close-icon" name="close" v-show="isEdit===true&&index!==0" />
          </van-grid-item>
        </van-grid>
      </div>

      <div class="channel">
        <div class="channel-head">
          <div>
            <span class="title">频道推荐</span>
            <span class="desc">点击添加频道</span>
          </div>
        </div>
        <van-grid class="channel-content" :gutter="10" clickable>
          <van-grid-item v-for="value in restChannels" :key="value.id">
            <div class="info" @click="push(value)">
              <span class="text">{{value.name}}</span>
            </div>
          </van-grid-item>
        </van-grid>
      </div>
    </van-popup>
  </div>
</template>

<script>
import { getAllChannels, resetUserChannels, deleUserChannel } from '@/api/article.js'
import { mapState } from 'vuex'
export default {
  name: 'channles',
  props: {
    value: {
      type: Boolean,
      default: false
    },
    active: {
      type: Number,
      default: 0
    },
    channels: {
      type: Array,
      default: () => []
    }
  },
  data () {
    return {
      isEdit: false,
      allChannels: []
    }
  },
  created () {
    this.ggetAllChannels()
  },
  computed: {
    // 处理全部频道和已有频道
    restChannels () {
      // 取出我的频道的id
      const userChannelIds = this.channels.map((item, i) => {
        return item.id
      })

      // 根据我的频道的id和所有频道的id进行筛选
      const restChannels = this.allChannels.filter((item, i) => {
        return !userChannelIds.includes(item.id)
      })

      return restChannels
    },
    ...mapState(['user'])
  },
  methods: {
    // 点击频道
    clickChannel (item, index) {
      if (!this.isEdit) {
        this.changeChanle(item, index)
      } else {
        if (index !== 0) {
          this.delChannel(item, index)
        } else {
          /* eslint-disable */
          return
        }
      }
    },
    // 进入频道
    changeChanle (item, index) {
      this.$emit('update:active-index', index)
      this.$emit('input', false)
      // console.log(index)
    },
    // 删除本地频道
    async delChannel (item, index) {
      this.channels.splice(index, 1)
      //给父组件一个删除提示
      this.$emit('delll')
      if (this.user) {
        await deleUserChannel(item.id)
      } else {
        window.localStorage.setItem('channels', JSON.stringify(this.channels))
      }
    },
    // 获取所有频道追加
    async ggetAllChannels () {
      const data = await getAllChannels()
      // console.log(data)
      data.channels.forEach(item => {
        item.articles = [] // 当前频道的文章列表数据
        item.downPullLoading = false // 当前频道下拉状态
        item.upPullLoading = false // 当前频道上拉加载更多
        item.upPullFinished = false // 当前频道加载完毕
        item.timestamp = Date.now() // 下一组数据的时间戳
      })
      this.allChannels = data.channels
    },
    async push (value) {
      this.channels.push(value)
      if (this.user) {
        const data = this.channels.slice(1).map((item, i) => {
          return {
            id: item.id,
            seq: i + 2
          }
        })
        await resetUserChannels(data)
      } else {
        window.localStorage.setItem('channels', JSON.stringify(this.channels))
      }
    }
  }
}
</script>

 <style lang="less" scoped>
.channel {
  .channel-head {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 10px;
    .title {
      font-size: 30px;
      margin-right: 5px;
    }
    .desc {
      font-size: 12px;
    }
  }
  .channel-content {
    .text {
      font-size: 16px;
    }
    .active {
      color: red;
    }
    .close-icon {
      font-size: 20px;
      position: absolute;
      top: -5px;
      right: -5px;
      z-index: 999;
      background-color: #fff;
    }
    .info {
      display: flex;
      align-items: center;
    }
  }
}
</style>
