<template>
  <div class="tabbarlayout-container">
    <keep-alive>
      <router-view></router-view>
    </keep-alive>
    <van-tabbar v-model="active">
      <van-tabbar-item icon="home-o">首页</van-tabbar-item>
      <van-tabbar-item icon="search">我的</van-tabbar-item>
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
