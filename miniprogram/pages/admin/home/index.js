const cloud = require('../../../utils/cloud')
const NAV_ITEMS = [
  { key: 'home', icon: '📊', label: '首页', url: '../home/index' },
  { key: 'visits', icon: '🙋', label: '咨询', url: '../visits/index' },
  { key: 'bookings', icon: '📋', label: '预约', url: '../bookings/index' },
  { key: 'schedule', icon: '📅', label: '课程', url: '../schedule/index' }
]
Page({
  data: { pendingCount: 0, visitCount: 0, confirmedCount: 0, navItems: NAV_ITEMS },
  onShow() { this.loadStats() },
  async loadStats() {
    const [bRes, vRes] = await Promise.all([cloud.getAllBookings(), cloud.getVisits()])
    if (bRes.code === 0) {
      const all = bRes.data
      this.setData({
        pendingCount: all.filter(b => b.status === 'pending').length,
        confirmedCount: all.filter(b => b.status === 'accepted').length
      })
    }
    if (vRes.code === 0) {
      this.setData({ visitCount: vRes.data.filter(v => v.status === 'pending').length })
    }
  },
  goTo(e) { wx.redirectTo({ url: e.currentTarget.dataset.url }) }
})
