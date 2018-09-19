<template>
  <div class="book-container">
    <book-swiper :value="hots"></book-swiper>
    <div class="book-table">
      <div class="book-card" v-for="book in books" :key="book.id" @click="toDetail(book.id)">
        <div class="avatar" @click.stop="toPreview(book.image)">
          <img class="image" :src="book.image" mode="aspectFit"/>
        </div>
        <div class="context">
          <div class="row header">
            <span class="col-left">{{book.title}}</span>
            <span class="col-right">
              <rate :value="book.rate"></rate>{{book.rate}}
            </span>
          </div>
          <div class="row">
            <span class="col-left">{{book.author}}</span>
            <span class="col-right">浏览量：{{book.count}}</span>
          </div>
          <div class="row">
            <span class="col-left">{{book.publisher}}</span>
            <span class="col-right">{{book.createName}}</span>
          </div>
        </div>
      </div>
      <p class="on-more" v-if="!more">没有更多了</p>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
  import Rate from '@/components/rate/index'
  import BookSwiper from '@/components/book-swiper/index'
  import { hotBook, listBook } from '@/api/book'
  export default {
    data() {
      return {
        hots: [],
        books: [],
        page: 0,
        size: 10,
        more: true
      }
    },
    mounted() {
      this._hotBooks()
      this._getBooks(true)
    },
    /** 下拉刷新 */
    onPullDownRefresh() {
      this._hotBooks()
      this._getBooks(true)
    },
    /** 上拉加载 */
    onReachBottom() {
      if (this.more) {
        this.page = this.page + 1
        this._getBooks(false)
      }
    },
    methods: {
      _hotBooks() {
        hotBook().then(res => {
          this.hots = res.data
        })
      },
      async _getBooks(init) {
        wx.showNavigationBarLoading()
        if (init) {
          this.page = 0
          this.more = true
        }
        const books = await listBook(this.page, this.size).then(res => {
          return res.data
        })
        if (books.length < this.size && this.page > 0) {
          this.more = false
        }
        if (init) {
          wx.stopPullDownRefresh()
          this.books = books
        } else {
          this.books = this.books.concat(books)
        }
        wx.hideNavigationBarLoading()
      },
      toPreview(image) {
        wx.previewImage({
          current: image, // 当前显示图片的http链接
          urls: [image] // 需要预览的图片http链接列表
        })
      },
      toDetail(id) {
        wx.navigateTo({
          url: `/pages/detail/main?id=${id}`
        })
      }
    },
    components: {
      Rate,
      BookSwiper
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  .book-container
    .book-table
      .on-more
        margin-bottom 20px
        color #cccccc
        font-size 14px
        text-align center
      .book-card
        display flex
        margin 20px
        .avatar
          width 90px
          height 90px
          .image
            max-width 100%
            max-height 100%
        .context
          margin-left 10px
          font-size 14px
          width 100%
          .row
            margin-bottom 10px
            .col-right
              float right
            &.header
              color #ea5149
</style>
