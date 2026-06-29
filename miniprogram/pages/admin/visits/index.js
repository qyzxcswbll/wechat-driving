const cloud = require('../../../utils/cloud')
const NAV_ITEMS = [
  { key: 'home', icon: '📊', label: '首页', url: '../home/index' },
  { key: 'visits', icon: '🙋', label: '咨询', url: '../visits/index' },
  { key: 'bookings', icon: '📋', label: '预约', url: '../bookings/index' },
  { key: 'schedule', icon: '📅', label: '课程', url: '../schedule/index' }
]
Page({
  data: { list: [], navItems: NAV_ITEMS },
  onShow() { this.load() },
  async load() {
    const res = await cloud.getVisits()
    if (res.code === 0) this.setData({ list: res.data })
  },
  async markDone(e) {
    await cloud.markContacted(e.currentTarget.dataset.id)
    wx.showToast({ title: '已标记' })
    this.load()
  },
  callPhone(e) { wx.makePhoneCall({ phoneNumber: e.currentTarget.dataset.phone }) }
,onShareAppMessage(){},onShareTimeline(){}})
