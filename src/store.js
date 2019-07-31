import Vue from 'vue'
import Vuex from 'vuex'
import * as auth from '@/utils/auth.js'
Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    // 获取
    user: auth.getUser()
  },
  mutations: {
    setUser (state, data) {
      // 修改state
      state.user = data
      // 将数据放到本地存储
      auth.setUser(state.user)
    }
  },
  actions: {

  }
})
