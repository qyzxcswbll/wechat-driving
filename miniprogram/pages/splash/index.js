const app = getApp()
Page({
  onLoad() {
    // 启动时自动请求通知授权（冷启动视为用户手势）
    wx.requestSubscribeMessage({
      tmplIds: ['0TTCrbD9ZDJTjouXteF5BXoeZZxV2mgG461In1BkPYo'],
      complete: () => {
        app.checkAuth()
      }
    })
  }
})
