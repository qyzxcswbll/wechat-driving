const { CLOUD_ENV } = require('./env')
const cloud = require('./utils/cloud')

App({
  globalData: { isAdmin: false, userInfo: null },
  onLaunch() {
    wx.cloud.init({ env: CLOUD_ENV })
  },
  async checkAuth() {
    try {
      const res = await cloud.login({
        nickName: this.globalData.userInfo?.nickName || '',
        avatarUrl: this.globalData.userInfo?.avatarUrl || ''
      })
      if (res.code === 0) {
        this.globalData.isAdmin = res.data.isAdmin
        this.globalData.userInfo = res.data.userInfo
        return true
      }
      return false
    } catch (e) {
      return false
    }
  }
})
