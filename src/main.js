import Vue from 'vue'
import App from './App'

Vue.config.productionTip = false
App.mpType = 'app'

const app = new Vue(App)
app.$mount()

export default {
  // 这个字段走 app.json
  config: {
    // 页面前带有 ^ 符号的，会被编译成首页，其他页面可以选填，我们会自动把 webpack entry 里面的入口页面加进去
    pages: ['^pages/book/main'],
    window: {
      backgroundTextStyle: 'light',
      navigationBarBackgroundColor: '#ea5149',
      navigationBarTitleText: '蜗牛图书',
      navigationBarTextStyle: 'light'
    },
    tabBar: {
      selectedColor: '#ea5149',
      list: [
        {
          pagePath: 'pages/book/main',
          text: '图书',
          iconPath: 'static/img/book.png',
          selectedIconPath: 'static/img/book-active.png'
        },
        {
          pagePath: 'pages/idea/main',
          text: '评论',
          iconPath: 'static/img/todo.png',
          selectedIconPath: 'static/img/todo-active.png'
        },
        {
          pagePath: 'pages/mine/main',
          text: '我的',
          iconPath: 'static/img/me.png',
          selectedIconPath: 'static/img/me-active.png'
        }
      ]
    }
  }
}
