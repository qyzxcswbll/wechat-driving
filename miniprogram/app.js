const { CLOUD_ENV } = require('./env')
const cloud = require('./utils/cloud')

App({
  globalData: { isAdmin: false, userInfo: null },
  onLaunch() {
    wx.cloud.init({ env: CLOUD_ENV })
    // 全局错误上报
    wx.onError((err) => {
      console.error('[全局错误]', err)
      try {
        const log = wx.getRealtimeLogManager ? wx.getRealtimeLogManager() : null
        if (log) log.error('全局错误', err)
      } catch (e) {}
    })
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
