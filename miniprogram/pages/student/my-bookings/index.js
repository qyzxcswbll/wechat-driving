const cloud = require('../../../utils/cloud')
const NAV_ITEMS = [
  { key: 'home', icon: '🏠', label: '首页', url: '../home/index' },
  { key: 'booking', icon: '📅', label: '预约', url: '../booking/index' },
  { key: 'my', icon: '📍', label: '我的', url: '../my-bookings/index' },
  { key: 'contact', icon: '💬', label: '联系', url: '../contact/index' }
]
Page({
  data: { list: [], navItems: NAV_ITEMS },
  onShow() { this.loadData() },
  async loadData() {
    wx.showLoading({ title: '加载中...' })
    const res = await cloud.getMyBookings()
    wx.hideLoading()
    if (res.code === 0) this.setData({ list: res.data })
  },
  goDetail(e) { wx.navigateTo({ url: '../booking-detail/index?id=' + e.currentTarget.dataset.id }) }
})
