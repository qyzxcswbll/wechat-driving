const app = getApp()
Page({
  data: { loggedIn: false, showNotify: false },
  async doLogin() {
    wx.showLoading({ title: '登录中...' })
    await app.checkAuth()
    wx.hideLoading()
    this.setData({ loggedIn: true, showNotify: true })
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
