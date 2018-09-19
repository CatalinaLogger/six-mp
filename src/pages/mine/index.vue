<template>
  <div class="mine-container">
    <div class="user-info" @click="login">
      <img :src="userInfo.avatarUrl" alt="">
      <p>{{userInfo.nickName}}</p>
    </div>
    <past-progress></past-progress>
    <button v-if="userInfo.openId" @click="scanBook">添加图书</button>
  </div>
</template>

<script type="text/ecmascript-6">
  import PastProgress from '@/components/past-progress'
  import qcloud from 'wafer2-client-sdk'
  import { addBook } from '@/api/book'

  export default {
    data() {
      return {
        baseUrl: process.env.BASE_URL,
        userInfo: {
          avatarUrl: '../../static/img/unlogin.png',
          nickName: '点击登录'
        }
      }
    },
    mounted() {
      let userInfo = wx.getStorageSync('userInfo')
      if (userInfo) {
        this.userInfo = userInfo
      }
    },
    methods: {
      scanBook() {
        wx.scanCode({
          success: (res) => {
            addBook(res.result).then(res => {
              if (res.code === 0) {
                wx.showModal({
                  title: '操作提示',
                  content: `《${res.data.title}》添加成功`,
                  showCancel: false
                })
              }
            })
          }
        })
      },
      login() {
        if (!this.userInfo.openId) {
          wx.showLoading({
            title: '登录中，请稍后'
          })
          // 设置登录地址
          qcloud.setLoginUrl(this.baseUrl + '/login')
          qcloud.login({
            success: () => {
              qcloud.request({
                url: this.baseUrl + '/user',
                login: true,
                success: (res) => {
                  wx.hideLoading()
                  this.userInfo = res.data.data
                  wx.setStorageSync('userInfo', this.userInfo)
                  wx.showToast({
                    title: '登录成功',
                    icon: 'success',
                    duration: 2000
                  })
                }
              })
            },
            fail: (err) => {
              wx.showToast({
                title: '登录失败',
                icon: 'none',
                duration: 2000
              })
              console.log('登录失败', err)
            }
          })
        }
      }
    },
    components: {
      PastProgress
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  .mine-container
    padding 20px
    .user-info
      text-align center
      padding 20rpx 0
      img
        margin 40rpx 0
        width 200rpx
        height 200rpx
        border-radius 50%
</style>

