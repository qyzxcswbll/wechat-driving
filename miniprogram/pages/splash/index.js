const app = getApp()
Page({
  data: { showNotify: true },
  onLoad() {
    // 先尝试自动登录，获取用户信息后再显示通知授权
    this.doLogin()
  },
  async doLogin() {
    wx.showLoading({ title: '加载中...' })
    await app.checkAuth()
    wx.hideLoading()
    // 登录完成后才显示通知授权按钮（此时已知是学员还是教练）
    this.setData({ showNotify: true })
  },
  enableNotify() {
    wx.requestSubscribeMessage({
      tmplIds: ['0TTCrbD9ZDJTjouXteF5BXoeZZxV2mgG461In1BkPYo'],
      complete: () => {
        this.goHome()
      }
    })
  },
  goHome() {
    const url = app.globalData.isAdmin
      ? '/pages/admin/home/index'
      : '/pages/student/home/index'
    wx.redirectTo({ url })
  }
})
