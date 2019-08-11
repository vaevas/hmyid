<template>
  <div>
    <van-nav-bar title="个人信息" left-text="返回" right-text="保存" left-arrow @click-left="$router.back()" @click-right="handleSave" />

    <van-cell-group>
      <van-cell is-link title="头像" @click="isUploadPhotoShow=true">
        <div slot="default">
          <img width="30" :src="user.photo" alt="">
        </div>
      </van-cell>
      <van-cell is-link title="昵称" :value="user.name" />
      <van-cell is-link title="介绍" value="内容" />
    </van-cell-group>

    <van-cell-group>
      <van-cell is-link title="性别" :value="user.gender === 0 ? '男' : '女'" />
      <van-cell is-link title="生日" :value="user.birthday" />
    </van-cell-group>

    <!-- 头像上传 -->
    <upload-photo v-model="isUploadPhotoShow" @upload-success="handleUploadSuccess"></upload-photo>
  </div>
</template>

<script>
import { getCurrentUserProfile, updateUserProfile } from '@/api/user.js'
import UploadPhoto from './components/upload-photo.vue'
export default {
  name: 'UserProfile',
  components: {
    UploadPhoto
  },
  data () {
    return {
      user: {},
      isUploadPhotoShow: false
    }
  },

  created () {
    this.loadProfileInfo()
  },

  methods: {
    handleUploadSuccess (photoSrc) {
      this.user.photo = photoSrc
    },
    async loadProfileInfo () {
      const data = await getCurrentUserProfile()
      // console.log(data)
      this.user = data
    },
    async handleSave () {
      await updateUserProfile({
        name: '神'
      })
    }
  }
}

</script>

<style lang="less" scoped></style>
