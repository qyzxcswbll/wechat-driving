const cloud = require('../../../utils/cloud')
const app = getApp()
Page({
  data: { nickName: '', phone: '', remark: '' },
  onLoad() {
    this.setData({ nickName: app.globalData.userInfo?.nickName || '' })
  },
  onPhoneInput(e) { this.setData({ phone: e.detail.value }) },
  onRemarkInput(e) { this.setData({ remark: e.detail.value }) },
  async submit() {
    if (!this.data.phone) return wx.showToast({ title: '请输入手机号', icon: 'none' })
    wx.showLoading({ title: '提交中...' })
    const res = await cloud.submitVisit({
      nickName: this.data.nickName,
      phone: this.data.phone,
      remark: this.data.remark
    })
    wx.hideLoading()
    if (res.code === 0) {
      // 请求订阅消息权限（需要在微信公众平台配置模板ID后启用）
      wx.requestSubscribeMessage({
        tmplIds: [],
        complete: () => {
          wx.showToast({ title: '提交成功' })
          setTimeout(() => wx.navigateBack(), 1500)
        }
      })
    } else {
      wx.showToast({ title: res.msg || '提交失败', icon: 'none' })
    }
  }
})
