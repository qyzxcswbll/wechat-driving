const cloud = require('../../../utils/cloud')
const NAV_ITEMS = [
  { key: 'home', icon: '🏠', label: '首页', url: '../home/index' },
  { key: 'booking', icon: '📅', label: '预约', url: '../booking/index' },
  { key: 'my', icon: '📍', label: '我的', url: '../my-bookings/index' },
  { key: 'contact', icon: '💬', label: '联系', url: '../contact/index' }
]
Page({
  data: { bookings: [], visits: [], tab: 'booking', navItems: NAV_ITEMS },
  onShow() { this.loadData() },
  async loadData() {
    wx.showLoading({ title: '加载中...' })
    const [bRes, vRes] = await Promise.all([cloud.getMyBookings(), cloud.getMyVisits()])
    wx.hideLoading()
    if (bRes.code === 0) this.setData({ bookings: bRes.data })
    if (vRes.code === 0) this.setData({ visits: vRes.data })
  },
  switchTab(e) { this.setData({ tab: e.currentTarget.dataset.tab }) },
  goDetail(e) { wx.navigateTo({ url: '../booking-detail/index?id=' + e.currentTarget.dataset.id }) }
})
