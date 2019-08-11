<template>
  <div>
    <van-search
      v-model="searchText"
      placeholder="请输入搜索关键词"
      show-action
      @search="onSearch(searchText)"
      @cancel="onCancel(searchText)"
    />
    <!-- 联想建议 -->
    <van-cell-group  v-if="associate.length&&searchText.trim().length">
      <van-cell
        icon="search"
        v-for="(item,index) in associate"
        :key="index"
        @click="onSearch(item)"
      >
        <div slot="title" v-html="highlight(item,searchText)"></div>
      </van-cell>
    </van-cell-group>

  <!-- 历史搜索记录 -->
  <van-cell-group v-else>
    <van-cell title="历史记录">
      <van-icon
        @click="isDeleteData=true"
        v-show="!isDeleteData"
        slot="right-icon"
        name="delete"
        style="line-height:inherit"
      ></van-icon>
      <div v-show="isDeleteData">
        <span style="margin-right:10px">全部删除</span>
        <span @click="isDeleteData=false">完成</span>
      </div>
    </van-cell>
    <van-cell :title="item" v-for="(item,index) in history" :key="index" @click="onSearch(item)">
      <van-icon v-show="isDeleteData" slot="right-icon" name="close" style="line-height:inherit"></van-icon>
    </van-cell>
  </van-cell-group>
  </div>
</template>

<script>
import { getSuggestion } from '@/api/search.js'
import { debounce } from '@/utils/debounce.js'
export default {
  name: 'SearchIndex',
  data () {
    return {
      searchText: '',
      associate: [],
      isDeleteData: false,
      // 历史记录
      history: JSON.parse(window.localStorage.getItem('history')) || []
    }
  },
  watch: {
    // 监听输入框的内容 防抖函数 防止同一时间多次触发事件
    searchText: debounce(async function () {
      if (!this.searchText.trim().length) {
        return
      }
      try {
        const suggestionData = await getSuggestion(this.searchText)
        // console.log(suggestionData)
        this.associate = suggestionData.options
      } catch (error) {}
    }, 300)
  },
  methods: {
    // 高亮处理
    highlight (item, searchText) {
      return item
        .toLowerCase()
        .split(searchText)
        .join(`<span style="color:green">${searchText}</span>`)
    },
    // 搜索触发
    onSearch (searchText) {
      // 如果输入框内有值,那么跳转到搜索结果页面
      if (searchText.length) {
        this.$router.push({
          name: 'search-result',
          params: {
            q: searchText
          }
        })
        // 函数去重,用Set方法类型会转变成既不是数组也不是对象如{1,2,3}
        const data = new Set(this.history)
        // 添加内容
        data.add(searchText)
        // 转成数组
        this.history = Array.from(data)
        // 储存到本地
        window.localStorage.setItem(
          'history',
          JSON.stringify(this.history))
        // 清空输入框内容
        this.searchText = ''
      } else {
        /* eslint-disable */
        return;
      }
    },
    onCancel(){
      this.$router.back()
    }
  }
};
</script>

<style  lang="less" scoped>
</style>
