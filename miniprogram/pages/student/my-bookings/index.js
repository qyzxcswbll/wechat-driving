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
    else wx.showToast({ title: '预约加载失败', icon: 'none' })
    if (vRes.code === 0) this.setData({ visits: vRes.data })
    else wx.showToast({ title: '参观记录加载失败', icon: 'none' })
  },
  switchTab(e) {
    this.setData({ tab: e.currentTarget.dataset.tab })
    this.loadData()  // 切换Tab时重新加载
  },
  goDetail(e) { wx.navigateTo({ url: '../booking-detail/index?id=' + e.currentTarget.dataset.id }) },
  subscribeMsg() {
    wx.requestSubscribeMessage({
      tmplIds: ['0TTCrbD9ZDJTjouXteF5BXoeZZxV2mgG461In1BkPYo']
    })
  },
  async cancelBooking(e) {
    const res = await wx.showModal({ title: '取消预约', content: '确定取消这个预约吗？', confirmText: '确定取消', confirmColor: '#A32D2D' })
    if (!res.confirm) return
    wx.showLoading({ title: '处理中...' })
    const result = await cloud.cancelBooking(e.currentTarget.dataset.id)
    wx.hideLoading()
    if (result.code === 0) {
      wx.showToast({ title: '已取消' })
      this.loadData()
    } else {
      wx.showToast({ title: result.msg || '取消失败', icon: 'none' })
    }
  }
})
