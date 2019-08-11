<template>
  <div class="auth-info">
    <div class="base-info">
      <img class="avatar" :src="authinfo.aut_photo" alt="">
      <div>
        <p>{{authinfo.aut_name}}</p>
        <p>{{authinfo.pubdate|relTime}}</p>
      </div>
    </div>
    <div>
      <van-button :type="authinfo.is_followed ? 'default':'danger'" :loading="loading" @click="attention">{{authinfo.is_followed?'已关注':'关注'}}</van-button>
    </div>
  </div>
</template>

<script>
import { followUser, unFollowUser } from '@/api/user.js'
export default {
  name: 'AuthInfo',
  props: {
    authinfo: {
      type: Object,
      default: () => {}
    }
  },
  data () {
    return {
      loading: false
    }
  },
  methods: {
    async attention () {
      try {
        // 关注和取消关注
        this.loading = true
        if (this.authinfo.is_followed) {
          await unFollowUser(this.authinfo.aut_id)
          this.authinfo.is_followed = false
        } else {
          await followUser(this.authinfo.aut_id)
          this.authinfo.is_followed = true
        }
      } catch (error) {
        console.dir(error)
      }
      // 取消动画
      this.loading = false
    }
  }
}
</script>

<style lang="less" scoped>
.auth-info {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 26px;
  .base-info {
    display: flex;
    align-items: center;
  }
  .avatar {
    margin-right: 10px;
    width: 100px;
    height: 100px;
    border-radius: 100%;
  }
}
</style>
