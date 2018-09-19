var Fly = require('flyio/dist/npm/wx')
var fly = new Fly()

// 设置超时
fly.config.timeout = 10000
// 设置请求基地址
fly.config.baseURL = process.env.BASE_URL

// 添加请求拦截器
fly.interceptors.request.use((request) => {
  // 给所有请求添加自定义header
  request.headers['x-token'] = 'token'
  request.headers['openid'] = wx.getStorageSync('userInfo').openId
  // 打印出请求体
  // console.log(request.body)
  // 终止请求
  // var err=new Error('xxx')
  // err.request=request
  // return Promise.reject(new Error(''))

  // 可以显式返回request, 也可以不返回，没有返回值时拦截器中默认返回request
  return request
})

// 添加响应拦截器，响应拦截器会在then/catch处理之前执行
fly.interceptors.response.use(
  response => {
    if (response.data.code !== 0) {
      wx.showModal({
        title: '操作提示',
        content: response.data.msg,
        showCancel: false
      })
      return Promise.reject(new Error())
    }
    // 只将请求结果的data字段返回
    return response.data
  },
  err => {
    // 发生网络错误后会走到这里
    // return Promise.resolve('ssss')
    console.log(err)
  }
)

export default fly
