<template>
  <div class="result-container">
    <van-nav-bar fixed title="搜索结果" left-text="返回" left-arrow @click-left="$router.back()"></van-nav-bar>
    <van-list
      class="search-list"
      v-model="loading"
      :finished="finished"
      finished-text="没有更多了"
      @load="onLoad"
    >
      <van-cell v-for="item in searchData" :key="item.art_id" :title="item.title" />
    </van-list>
  </div>
</template>

<script>
import { getSearch } from '@/api/search.js'
export default {
  name: 'SearchResult',
  data () {
    return {
      searchData: [],
      page: 1,
      perPage: 10,
      finished: false,
      loading: false
    }
  },
  computed: {
    q () {
      return this.$route.params.q
    }
  },
  // keep-alive 组件停用时调用-> 缓存刚做完 就触发->此时 ,有缓存
  deactivated () {
    // 清除缓存的组件->干掉组件
    // this->当前Vue构造函数的实例化对象->Vue实例->Vue实例对象->obj.属性|obj.方法()->文档中Vue实例的.方法()

    // 完全销毁一个实例。->干掉组件

    this.$destroy()
  },
  created () {
    this.onLoad()
  },
  methods: {
    async onLoad () {
      await this.$delay(800)
      try {
        const data = await getSearch({ page: this.page, perPage: this.perPage, q: this.q })
        // console.log(data)
        if (data.results.length === 0) {
          this.finished = true
          this.loading = false
        } else {
          this.searchData.push(...data.results)
          this.page++
          this.loading = false
        }
      } catch (error) {
        console.dir(error)
      }
    }
  }

}
</script>

<style scoped lang='less'>
  .result-container .van-nav-bar {
  background-color: #0096fa;

  .van-nav-bar__title,
  .van-nav-bar__text,
  .van-icon {
    color: #fff;
  }
}
</style>
