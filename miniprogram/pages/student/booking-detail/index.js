const cloud = require('../../../utils/cloud')
Page({
  data: { info: {} },
  onLoad(options) {
    wx.showLoading({ title: '加载中...' })
    cloud.getMyBookings().then(res => {
      wx.hideLoading()
      if (res.code === 0) {
        const item = res.data.find(b => b._id === options.id)
        if (item) this.setData({ info: item })
      }
    })
  }
,onShareAppMessage(){},onShareTimeline(){}})
