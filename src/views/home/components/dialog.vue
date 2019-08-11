<template>
  <div class="dialog-container">
    <van-dialog
      :value="value"
      @input="$emit('input')"
      :show-cancel-button="false"
      :showConfirmButton="false"
      closeOnClickOverlay
    >
      <van-cell-group v-if="!isReportShow">
        <van-cell icon="location-o" title="不感兴趣" @click="indifferent()" />
        <van-cell icon="location-o" title="反馈垃圾内容" is-link @click="isReportShow=true" />
        <van-cell icon="location-o" title="拉黑作者" />
      </van-cell-group>
      <van-cell-group v-else>
        <van-cell icon="arrow-left" @click="isReportShow=false" />
        <van-cell
          :title="item.label"
          @click="report(item.value)"
          icon="location-o"
          v-for="(item) in reportTypes"
          :key="item.value"
        />
      </van-cell-group>
    </van-dialog>
  </div>
</template>

<script>
import { dislikesArticle, reportArticle } from '@/api/article.js'
export default {
  name: 'Dialog',
  props: {
    value: {
      type: Boolean,
      default: false
    },
    selectedArticles: {
      type: Object,
      // 如果default的值是非基本类型,此时数据默认值应该作为函数的返回值 此{}不是箭头函数是返回值是 空对象
      default: () => {}
    }
  },
  data () {
    return {
      isReportShow: false,
      reportTypes: [
        { label: '其他问题', value: 0 },
        { label: '标题夸张', value: 1 },
        { label: '低俗色情', value: 2 },
        { label: '错别字多', value: 3 },
        { label: '旧闻重复', value: 4 },
        { label: '广告软文', value: 5 },
        { label: '内容不实', value: 6 },
        { label: '涉嫌违法犯罪', value: 7 },
        { label: '侵权', value: 8 }
      ]
    }
  },
  methods: {
    // 文章不喜欢发送请求
    async indifferent () {
      const { art_id: id } = this.selectedArticles
      // console.log(id)
      try {
        await dislikesArticle(id)
        // console.log(id)
        // 触发父组件更新视图方法
        this.$emit('falseDelete')
        // 关闭对话框
        this.$emit('input', false)
        // 提示
        this.$toast('操作成功')
      } catch (error) {
        console.dir(error)
      }
    },
    // 文章举报
    async report (type) {
      const { art_id: target } = this.selectedArticles
      try {
        await reportArticle({
          target,
          type
        })
        // 关闭对话框
        this.$emit('input', false)
        // 提示
        this.$toast('举报成功')
        // console.log(data)
      } catch (error) {
        if (error.response.status === 409) {
          this.$toast('已被举报过')
          this.$emit('input', false)
        } else {
          this.$toast('举报失败')
          this.$emit('input', false)
        }
      }
    }
  }
}
</script>

<style scoped lang='less'></style>
