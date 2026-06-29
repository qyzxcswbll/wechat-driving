const cloud = require('../../../utils/cloud')
Page({
  data: { info: {} },
  onLoad() {
    cloud.getSchoolInfo().then(r => { if(r.code===0) this.setData({info: r.data}) })
  },
  callPhone(e) { wx.makePhoneCall({ phoneNumber: e.currentTarget.dataset.phone }) },
  copyWechat() {
    wx.setClipboardData({ data: this.data.info.schoolName + '教练微信' })
  }
,onShareAppMessage(){},onShareTimeline(){}})
