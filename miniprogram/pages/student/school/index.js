const cloud = require('../../../utils/cloud')
Page({
  data: { info: {} },
  onLoad() {
    cloud.getSchoolInfo().then(r => { if(r.code===0) this.setData({info: r.data}) })
  },
  callPhone(e) { wx.makePhoneCall({ phoneNumber: e.currentTarget.dataset.phone }) },
  goVisit() { wx.navigateTo({ url: '../visit/index' }) },
  openMap() {
    const info = this.data.info
    wx.openLocation({
      latitude: Number(info.latitude),
      longitude: Number(info.longitude),
      name: info.schoolName || '驾校',
      address: info.address || ''
    })
  }
,
  onShareAppMessage(){return{title:"轻松上路 - 驾校详情"}},
  onShareTimeline(){return{title:"轻松上路 - 驾校详情"}}
})
