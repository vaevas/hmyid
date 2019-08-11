<template>
  <div class="chat">
    <van-nav-bar fixed title="聊天" left-text="返回" left-arrow @click-left="$router.back()"></van-nav-bar>

    <div class="chat-window" ref="chat-window">
      <van-cell :class="item.from!=='myself'?'left':'right'" v-for="(item,index) in msgs" :key="index" :value="item.msg" />
      <div class="clear"></div>
    </div>

    <van-cell-group border class="sendmsg">
      <van-field border v-model="msg" center>
        <van-button slot="button" size="small" type="primary" :disabled="!isConnect || !msg.length" @click="sendMsg">发送</van-button>
      </van-field>
    </van-cell-group>
  </div>
</template>

<script>
import io from 'socket.io-client'

export default {
  name: 'Chat',
  components: {},
  data () {
    return {
      msg: '你好,小智机器人',
      msgs: [],
      socket: null,
      isConnect: false
    }
  },
  watch: {},
  methods: {
    sendMsg () {
      // this.sendMsgToRobat()
      this.setSocket()
    },
    sendMsgToRobat () {
      // 发送消息
      this.socket.emit('message', {
        msg: this.msg,
        timestamp: Date.now()
      })
      // 更新视图
      this.msgs.push({
        msg: this.msg,
        from: 'myself'
      })
      this.msg = ''
      this.recMsg()
    },
    // 接收消息
    recMsg () {
      this.socket.on('message', data => {
        // console.log(data)
        // 更新视图
        if (data.msg) {
          this.msgs.push({
            msg: data.msg,
            from: 'yourself'
          })
        }
        // 关闭连接
        this.socket.close()
      })
    },
    setSocket () {
      // 连接->发消息 -> 收消息 -> 关闭

      this.socket = io('http://ttapi.research.itcast.cn', {
        query: {
          token: this.$store.state.user.token
        }
      })
      this.socket.on('connect', () => {
        console.log('连接成功了----')
        this.isConnect = true
        // 发消息
        this.sendMsgToRobat() // ??->发消息 -> 收消息 -> 关闭
      })
    }
  },
  created () {
    if (this.$store.state.user) {
      this.setSocket()
    }
  }
}
</script>

<style lang='less' scoped>
.van-nav-bar {
  background-color: #1989fa;
  .van-nav-bar__title {
    color: #ffffff;
  }
}

.sendmsg {
  position: fixed;
  left: 0;
  bottom: 0;
  width: 100%;
}
.sendmsg /deep/ .van-cell {
  border: 1px solid black;
}

.chat .chat-window {
  position: relative;
  top: 92px;
  font-size: 14px;
}
.chat /deep/ .van-nav-bar__text {
  color: #ffffff;
}
.clear {
  height: 102px;
}
.chat-window /deep/ .left .van-cell__value {
  color: red;
}
.chat-window /deep/ .right .van-cell__value {
  color: green;
}
</style>
