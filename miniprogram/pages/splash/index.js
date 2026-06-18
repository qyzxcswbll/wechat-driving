const app = getApp()
const cloud = require('../../utils/cloud')
Page({
  data: { loading: true, authed: false, schoolName: '' },
  onLoad() {
    // 加载驾校名称
    cloud.getSchoolInfo().then(r => {
      if (r.code === 0 && r.data.schoolName) {
        this.setData({ schoolName: r.data.schoolName })
        wx.setNavigationBarTitle({ title: r.data.schoolName })
      }
    })
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
