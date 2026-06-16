const cloud = require('../../../utils/cloud')
const NAV_ITEMS = [
  { key: 'home', icon: '📊', label: '首页', url: '../home/index' },
  { key: 'visits', icon: '🙋', label: '咨询', url: '../visits/index' },
  { key: 'bookings', icon: '📋', label: '预约', url: '../bookings/index' },
  { key: 'schedule', icon: '📅', label: '课程', url: '../schedule/index' }
]
Page({
  data: { list: [], displayList: [], filterIdx: 0, filters: ['全部', '待处理', '已接受', '已拒绝'], navItems: NAV_ITEMS },
  onShow() { this.load() },
  async load() {
    const res = await cloud.getAllBookings()
    if (res.code === 0) {
      this.setData({ list: res.data })
      this.applyFilter()
    }
  },
  applyFilter() {
    const idx = this.data.filterIdx
    let displayList = this.data.list
    if (idx === 1) displayList = displayList.filter(b => b.status === 'pending')
    else if (idx === 2) displayList = displayList.filter(b => b.status === 'accepted')
    else if (idx === 3) displayList = displayList.filter(b => b.status === 'rejected')
    this.setData({ displayList })
  },
  onFilter(e) {
    this.setData({ filterIdx: parseInt(e.detail.value) })
    this.applyFilter()
  },
  async acceptBooking(e) {
    wx.showLoading({ title: '处理中...' })
    await cloud.handleBooking(e.currentTarget.dataset.id, 'accepted')
    wx.hideLoading()
    wx.showToast({ title: '已接受' })
    // TODO: 配置微信订阅消息模板后，通知学员
    // cloud.sendNotify({
    //   openid: booking.openid,
    //   templateId: 'TEMPLATE_ID',
    //   data: { ... }
    // })
    this.load()
  },
  async rejectBooking(e) {
    wx.showModal({
      title: '拒绝原因',
      content: '',
      editable: true,
      placeholderText: '请输入拒绝原因',
      success: async (res) => {
        if (res.confirm && res.content) {
          wx.showLoading({ title: '处理中...' })
          await cloud.handleBooking(e.currentTarget.dataset.id, 'rejected', res.content)
          wx.hideLoading()
          wx.showToast({ title: '已拒绝' })
          // TODO: 配置微信订阅消息模板后，通知学员
          this.load()
        }
      }
    })
  },
  callPhone(e) { wx.makePhoneCall({ phoneNumber: e.currentTarget.dataset.phone }) }
})
