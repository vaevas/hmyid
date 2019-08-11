<template>
  <div>
    <van-dialog :value="value" @input="$emit('input', $event)" :show-confirm-button="false">
      <van-cell-group>
        <van-cell title="从相册选择" @click="open" />
        <input style="display: none;" type="file" ref="input" @change="changefile"/>
        <van-cell title="拍照" />
        <van-cell title="取消" @click="$emit('input', false)" />
      </van-cell-group>
    </van-dialog>
  </div>
</template>

<script>
import { ImagePreview } from 'vant'
import { updateUserPhoto } from '@/api/user.js'
export default {
  name: 'UploadPhoto',
  props: {
    value: {
      type: Boolean,
      default: false
    }
  },

  data () {
    return {
    }
  },

  computed: {

  },

  methods: {
    changefile () {
      const file = this.$refs.input.files[0]
      const reader = new FileReader()
      reader.readAsDataURL(file)
      reader.onload = () => {
        ImagePreview({
          images: [reader.result],
          // startPosition: 1,
          showIndex: false,
          // 箭头函数的使用场景: 所有使用匿名函数的位置最好改为()=>{}

          onClose: () => {
            // 打开确认框
            this.openDia()
          }
        })
      }
    },
    openDia () {
      this.$dialog
        .confirm({
          title: '是否确认选择该图片为头像??'
        })
        .then(() => {
          this.updatePhoto()
        })
        .catch(() => {
          // on cancel
          this.$emit('input', false)
        })
    },
    async updatePhoto () {
      const data = await updateUserPhoto('photo', this.$refs['input'].files[0])
      // console.log(data)
      // data.photo -> 服务端把file文件转换成了图片url
      if (data.photo) {
        // 把data.photo交给父组件使用
        this.$emit('upload-success', data.photo)
        // 关闭对话框
        this.$emit('input', false)
      }
    },
    open () {
      this.$refs.input.click()
    }
  }
}
</script>

<style>
</style>
