import Vue from 'vue'
import Router from 'vue-router'
Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      component: () =>
          import('@/views/tabbar-layout'),
      children: [{
        path: '/',
        name: 'home',
        component: () => import('@/views/home')
      },
      {
        path: '/mine',
        name: 'mine',
        component: () => import('@/views/me')
      }]
    },
    { name: 'login', path: '/login', component: () => import('@/views/login') },
    {
      path: '/search',
      name: 'search',
      component: () =>
          import('@/views/search')
    },
    {
      path: '/search-result',
      name: 'search-result',
      component: () =>
          import('@/views/search/search-result.vue')
    },
    {
      name: 'article',
      path: '/article/:articleId',
      component: () =>
          import('@/views/article')
    },
    {
      name: 'user-profile',
      path: '/user-profile',
      component: () =>
          import('@/views/user-profile')
    },
    {
      name: 'chat',
      path: '/chat',
      // 路由的 ->组件的懒加载
      component: () =>
          import('@/views/chat')
    }
  ]
})
