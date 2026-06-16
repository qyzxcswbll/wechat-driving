const cloud = require('../../../utils/cloud')
Page({
  data: { info: {} },
  onLoad() {
    cloud.getSchoolInfo().then(r => { if(r.code===0) this.setData({info: r.data}) })
  },
  callPhone(e) { wx.makePhoneCall({ phoneNumber: e.currentTarget.dataset.phone }) },
  goVisit() { wx.navigateTo({ url: '../visit/index' }) }
})
