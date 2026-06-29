const cloud = require('../../../utils/cloud')
Page({
  data: { info: {} },
  onLoad() {
    cloud.getSchoolInfo().then(r => { if(r.code===0) this.setData({info: r.data}) })
  },
  callPhone(e) { wx.makePhoneCall({ phoneNumber: e.currentTarget.dataset.phone }) },
  openMap() {
    const info = this.data.info
    if (!info.latitude || !info.longitude) return wx.showToast({ title: '教练暂未设置位置', icon: 'none' })
    wx.openLocation({
      latitude: Number(info.latitude),
      longitude: Number(info.longitude),
      name: info.schoolName || '驾校',
      address: info.address || '',
      fail: () => wx.showToast({ title: '位置信息异常', icon: 'none' })
    })
  },
  copyWechat() {
    const wechatId = this.data.info.wechatId
    if (wechatId) {
      wx.setClipboardData({ data: wechatId })
      wx.showToast({ title: '微信号已复制' })
    } else {
      wx.showToast({ title: '教练暂未设置微信号', icon: 'none' })
    }
  },
  onShareAppMessage() {
    return { title: '轻松上路 - 联系我们' }
  },
  onShareTimeline() {
    return { title: '轻松上路 - 联系我们' }
  }
})
