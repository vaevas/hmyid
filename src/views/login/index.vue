<template>
  <div class="login-container">
    <van-nav-bar title="登录" />
    <form action="/" method="POST">
      <van-cell-group>
        <van-field
          v-model="user.mobile"
          clearable
          label="手机号"
          placeholder="请输入手机号"
          v-validate="'required|phone'"
          :error-message="errors.first('手机号')"
          name="手机号"
        />
        <van-field v-model="user.code" label="验证码" placeholder="请输入验证码" />
      </van-cell-group>
      <van-button type="info" block @click.prevent="login" :loading="loading">登录</van-button>
    </form>
  </div>
</template>

<script>
import { logining } from '@/api/user.js'
export default {
  data () {
    return {
      user: {
        mobile: '18801185985',
        code: '246810'
      },
      loading: false
    }
  },
  methods: {
    async login () {
      this.loading = true
      try {
        // 验证规则是否通过
        this.$validator.validate().then(async valid => {
          // 如果没通过
          if (!valid) {
            this.loading = false
            return
          }
          // 验证通过
          const data = await logining(this.user)
          // console.log(data)
          this.$store.commit('setUser', data)
          this.loading = false
          // 进入tabbar组件
          this.$router.push({ path: '/' })
        }).catch(() => {
          this.loading = false
          this.$toast('验证码错误')
        })
      } catch (error) {
        console.log(error)
      }
    }
  }
}
</script>

<style scoped lang='less'>
.login-container .van-nav-bar {
  background: #3296fa;
  .van-nav-bar__title {
    color: #fff;
  }
}
</style>
