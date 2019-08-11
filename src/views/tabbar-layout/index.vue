<template>
  <div class="tabbarlayout-container">
    <keep-alive>
      <router-view></router-view>
    </keep-alive>
    <van-tabbar v-model="active" router>
      <van-tabbar-item icon="home-o" to="/">首页</van-tabbar-item>
      <van-tabbar-item icon="search" to="/mine">{{ $store.state.user ? '我的' : '未登录'}}</van-tabbar-item>
    </van-tabbar>
  </div>
</template>

<script>
export default {
  name: 'tabbarlayout',
  data () {
    return {
      active: 0
    }
  }
}
</script>

<style scoped lang='less'>

</style>
