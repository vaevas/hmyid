<template>
  <div class="dialog-container">
    <van-dialog
      :value="value"
      @input="$emit('input')"
      :show-cancel-button="false"
      :showConfirmButton="false"
      closeOnClickOverlay
    >
      <span>爱看的卡萨诺</span>
    </van-dialog>
  </div>
</template>

<script>
export default {
  name: 'Dialog',
  props: {
    value: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {}
  }
}
</script>

<style scoped lang='less'></style>
