const { CLOUD_ENV } = require('./env')
App({
  globalData: { isAdmin: false, userInfo: null },
  onLaunch() {
    wx.cloud.init({ env: CLOUD_ENV })
  }
})
