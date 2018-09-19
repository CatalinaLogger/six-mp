<template>
  <span class="rate-wrapper">
    <span>☆☆☆☆☆</span>
    <span class="foreground" :style="style">★★★★★</span>
  </span>
</template>

<script type="text/ecmascript-6">
  export default {
    props: {
      value: {
        type: Number,
        default: 0
      }
    },
    computed: {
      style() {
        return `width: ${this.value / 2}em`
      }
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  .rate-wrapper
    position relative
    .foreground
      position absolute
      top 0
      left 0
      width 0
      overflow hidden
</style>
