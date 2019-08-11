// 配置axios
import axios from 'axios'
import store from '@/store.js'
import JSONBig from 'json-bigint'
import router from 'vue-router'
const request = axios.create(
  { baseURL: `http://ttapi.research.itcast.cn` }
)
// 对js最大安全值进行处理
request.defaults.transformResponse = [function (data) {
  try {
    return JSONBig.parse(data)
  } catch (error) {
    return data
  }
}]
// 添加请求拦截器
request.interceptors.request.use(function (config) {
  // 在发送请求之前做些什么
  const { user } = store.state
  config.url !== '/app/v1_0/authorizations' &&
    user &&
    (config.headers.Authorization = `Bearer ${user.token}`)
  return config
}, function (error) {
  // 对请求错误做些什么
  return Promise.reject(error)
})

// 添加响应拦截器
request.interceptors.response.use(function (response) {
  // 对响应数据做点什么
  // 如果响应结果对象中有 data，则直接返回这个 data 数据
  // 如果响应结果对象中没有 data，则不作任何处理，直接原样返回这个数据
  return response.data.data || response.data
}, async function (error) {
  // 对响应错误做点什么
  if (error.response.status === 401) {
    const user = store.state.user
    if (user) {
      try {
        // 因为用request发生401错误所以要用axios发送请求不然会死循环
        const { data: { data } } = await axios({
          method: 'put',
          url: 'http://ttapi.research.itcast.cn/app/v1_0/authorizations',
          headers: { Authorization: `Bearer ${user.refresh_token}` }
        })
        // console.log(data)
        // 拿到最新的token再设置一下
        store.commit('setUser', {
          token: data.token,
          refresh_token: user.refresh_token
        })
        return request(error.config)
      } catch (error) {
        router.push('/login')
      }
    }
  } else {
    router.push('/login')
  }
  return Promise.reject(error)
})
export default request
