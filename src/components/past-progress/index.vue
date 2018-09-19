<template>
  <div class="past-progress">
    <progress :percent="percent" stroke-width="16" activeColor="#ea5149" active/>
    <p>{{year}}已经过去了{{days}}天, {{percent}}%</p>
  </div>
</template>

<script type="text/ecmascript-6">
  export default {
    data() {
      return {
        year: new Date().getFullYear()
      }
    },
    computed: {
      days() {
        let start = new Date()
        start.setMonth(0)
        start.setDate(1)
        let offset = new Date().getTime() - start.getTime()
        return parseInt(offset / 1000 / 60 / 60 / 24) + 1
      },
      percent() {
        return (this.days * 100 / this.getDayOfYear()).toFixed(1)
      }
    },
    methods: {
      getDayOfYear() {
        return this.isLeapYear(this.year) ? 366 : 365
      },
      // 判断是否为润年
      isLeapYear(Year) {
        if ((Year % 4 === 0 && Year % 100 !== 0) || Year % 400 === 0) {
          return true
        } else {
          return false
        }
      }
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  .past-progress
    margin-bottom 20rpx
</style>
