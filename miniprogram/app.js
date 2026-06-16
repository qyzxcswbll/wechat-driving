const { CLOUD_ENV } = require('./env')
const cloud = require('./utils/cloud')

App({
  globalData: { isAdmin: false, userInfo: null },
  onLaunch() {
    wx.cloud.init({ env: CLOUD_ENV })
  },
  async checkAuth() {
    wx.showLoading({ title: '加载中...' })
    const res = await cloud.login({
      nickName: this.globalData.userInfo?.nickName || '',
      avatarUrl: this.globalData.userInfo?.avatarUrl || ''
    })
    wx.hideLoading()
    if (res.code === 0) {
      this.globalData.isAdmin = res.data.isAdmin
      this.globalData.userInfo = res.data.userInfo

      // Get user profile for non-admin users
      if (!res.data.isAdmin) {
        wx.getUserProfile({
          desc: '用于展示用户信息',
          success: (profile) => {
            if (profile && profile.userInfo) {
              this.globalData.userInfo = {
                ...this.globalData.userInfo,
                ...profile.userInfo
              }
            }
          },
          fail: () => {
            // User declined profile access, proceed with basic info
            console.log('用户拒绝授权个人信息')
          }
        })
      }

      const homePage = res.data.isAdmin
        ? '/pages/admin/home/index'
        : '/pages/student/home/index'
      wx.redirectTo({ url: homePage })
    } else {
      wx.showToast({ title: '登录失败', icon: 'none' })
    }
  }
})
