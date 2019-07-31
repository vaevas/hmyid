import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import Vant, { Lazyload } from 'vant'
import 'vant/lib/index.css'
import 'amfe-flexible/index.min.js'
import '@/styles/index.less'
import VeeValidate, { Validator } from 'vee-validate'
import CN from 'vee-validate/dist/locale/zh_CN'
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import 'dayjs/locale/zh-cn'

dayjs.locale('zh-cn')
dayjs.extend(relativeTime)

Vue.use(Vant)
Vue.use(VeeValidate)
Vue.use(Lazyload)
Validator.localize('zh_CN', CN)

Validator.extend('phone', {
  getMessage: field => '请输入正确的手机号',
  validate: value => value.length === 11 && /^((13|14|15|17|18)[0-9]{1}\d{8})$/.test(value)
})

// 时间全局过滤器
Vue.filter('relTime', value => {
  return dayjs()
    .locale('zh-cn')
    .from(value)
})
// 延迟加载
/* eslint-disable */
Vue.prototype.$delay = (time) => {
  return new Promise((re) => {
    setTimeout(() => {
      re()
    }, time)
  })
}
Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
