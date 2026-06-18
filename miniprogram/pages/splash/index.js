const app = getApp()
Page({
  data: { loading: true, authed: false },
  onLoad() {
    this.autoLogin()
  },
  async autoLogin() {
    const res = await app.checkAuth()
    if (res === true) {
      const url = app.globalData.isAdmin
        ? '/pages/admin/home/index'
        : '/pages/student/home/index'
      wx.redirectTo({ url })
    } else {
      this.setData({ loading: false, authed: false })
    }
  },
  async doLogin() {
    this.setData({ loading: true })
    await this.autoLogin()
  }
})
