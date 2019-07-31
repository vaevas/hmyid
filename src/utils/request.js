// 配置axios
import axios from 'axios'
import store from '@/store.js'
const request = axios.create(
  { baseURL: `http://ttapi.research.itcast.cn` }
)
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
}, function (error) {
  // 对响应错误做点什么
  return Promise.reject(error)
})
export default request
