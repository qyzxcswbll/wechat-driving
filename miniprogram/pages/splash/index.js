const app = getApp()
Page({
  data: { loading: false },
  async doLogin() {
    this.setData({ loading: true })
    await app.checkAuth()
    const url = app.globalData.isAdmin
      ? '/pages/admin/home/index'
      : '/pages/student/home/index'
    wx.redirectTo({ url })
  }
})
