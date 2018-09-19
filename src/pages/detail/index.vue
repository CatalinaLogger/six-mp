<template>
  <div class="detail-container">
    <div class="header">
      <img class="background" :src="book.image" mode="aspectFill">
      <img class="foreground" :src="book.image" mode="aspectFit">
      <div class="info-text">
        <p class="title">{{book.title}}</p>
        <p class="author">{{book.author}}</p>
      </div>
    </div>
    <div class="content">
      <div class="row-info">
        <div class="col-left">
          <img class="avatar" :src="book.avatarUrl" mode="aspectFit">{{book.createName}}
        </div>
        <div class="col-right rate">
          <rate :value="book.rate"></rate>{{book.rate}}
        </div>
      </div>
      <div class="row-info">
        <div class="col-left">
          {{book.publisher}}
        </div>
        <div class="col-right">
          {{book.price}}
        </div>
      </div>
      <div class="tags">
        <div class="tag" v-for="tag in book.tags" :key="tag">{{tag}}</div>
      </div>
      <div class="summary">
        <p class="part" v-for="sum in book.summary" :key="sum">{{sum}}</p>
      </div>
      <div class="comment">
        <textarea class="text-area" v-model="comment" :maxlength="100" placeholder="我来说两句"></textarea>
      </div>
      <div class="row-option">
        所在位置：{{address}}
        <switch class="right-switch" color="#ea5914" :chenked="address" @change="addressChange"/>
      </div>
      <div class="row-option">
        手机型号：{{device}}
        <switch class="right-switch" color="#ea5914" :chenked="device" @change="deviceChange"/>
      </div>
      <div class="row-button">
        <button :disabled="!comment" @click="addComment">评论</button>
      </div>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
  import Rate from '@/components/rate/index'
  import { detailBook } from '@/api/book'
  import { addComment, listComment } from '@/api/comment'
  export default {
    data() {
      return {
        id: null,
        book: {},
        comments: [],
        comment: '',
        address: '',
        device: ''
      }
    },
    mounted() {
      this.id = this.$root.$mp.query.id
      this._getDetail()
      this._getComments()
    },
    methods: {
      addressChange(e) {
        if (e.target.value) {
          wx.getLocation({
            success: geo => {
              wx.request({
                url: 'https://apis.map.qq.com/ws/geocoder/v1/',
                data: {
                  location: `${geo.latitude},${geo.longitude}`,
                  key: '5PWBZ-GHMK6-UZFSZ-EHAQG-RXPO2-EFBAB'
                },
                success: res => {
                  if (res.data.status === 0) {
                    const c = res.data.result.address_component
                    this.address = `${c.province} ${c.city}`
                  }
                }
              })
            }
          })
        } else {
          this.address = ''
        }
      },
      addComment() {
        if (this.comment) {
          let comment = {
            bookId: this.id,
            comment: this.comment,
            address: this.address,
            device: this.device
          }
          addComment(comment).then(res => {
            console.log(res)
          })
        }
      },
      deviceChange(e) {
        if (e.target.value) {
          const device = wx.getSystemInfoSync()
          this.device = device.model
        } else {
          this.device = ''
        }
      },
      _getDetail() {
        detailBook(this.id).then(res => {
          this.book = res.data
          wx.setNavigationBarTitle({
            title: this.book.title
          })
        })
      },
      _getComments() {
        listComment(this.id).then(res => {
          console.log(res)
        })
      }
    },
    components: {
      Rate
    }
  }
  </script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  .detail-container
    .header
      position relative
      width 100%
      height 500rpx
      overflow hidden
      .background
        width 100%
        filter blur(15px)
      .foreground
        position absolute
        top 30rpx
        left 0
        width 100%
        height 350rpx
      .info-text
        position absolute
        top 390rpx
        left 0
        width 100%
        color white
        text-align center
        .header
          font-size 16px
        .author
          font-size 14px

    .content
      width 100%
      font-size 14px
      .row-info
        margin 10px
        .col-left
          display inline-block
          .avatar
            margin-right 10px
            width 20px
            height 20px
            vertical-align middle
        .col-right
          display inline-block
          float right
          &.rate
            color #ea5914
      .tags
        margin 5px
        .tag
          display inline-block
          margin 5px
          padding 5px
          color #ea5149
          border-radius 10px
          border 1px solid #ea5149
      .summary
        margin 10px
        font-size 14px
        .part
          text-indent 2em
      .comment
        .text-area
          width 100%
          background #ccc
      .row-option
        margin 10px
        line-height 34px
        font-size 16px
        .right-switch
          float right
      .row-button
        margin 10px
</style>

