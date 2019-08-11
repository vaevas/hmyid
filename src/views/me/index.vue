<template>
  <div>
    <un-login v-if="!$store.state.user" />
    <user-info v-else />
  </div>
</template>

<script>
import UnLogin from './components/un-login'
import UserInfo from './components/user-info'

export default {
  name: 'MyIndex',
  components: {
    UnLogin,
    UserInfo
  },

  data () {
    return {

    }
  },

  created () {

  },

  methods: {

  }
}
</script>

<style lang="less" scoped></style>
