<template>
  <div class="swiper-wrapper">
    <swiper :indicator-dots="true"
            indicator-color="#cccccc"
            indicator-active-color="#ea5914"
            :autoplay="true"
            :interval="6000"
            :duration="1000"
            :circular="true">
      <div v-for="(group, indexGroup) in bookGroups" :key="indexGroup">
        <swiper-item>
          <img class="book-image" v-for="book in group" :key="book.id" :src="book.image" mode="aspectFit" @click="toDetail(book.id)">
        </swiper-item>
      </div>
    </swiper>
  </div>
</template>

<script type="text/ecmascript-6">
  import { groupChunk } from '@/utils/index'
  export default {
    props: {
      value: {
        type: Array,
        default: []
      }
    },
    computed: {
      bookGroups() {
        return groupChunk(this.value, 3)
      }
    },
    methods: {
      toDetail(id) {
        wx.navigateTo({
          url: `/pages/detail/main?id=${id}`
        })
      }
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  .swiper-wrapper
    margin 20px
    .book-image
      width 33%
      height 250rpx
</style>
