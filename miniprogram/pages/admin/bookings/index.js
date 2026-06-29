const cloud = require('../../../utils/cloud')
function fmtTime(d) {
  const pad = n => String(n).padStart(2, '0')
  return d.getFullYear() + '-' + pad(d.getMonth()+1) + '-' + pad(d.getDate()) + ' ' + pad(d.getHours()) + ':' + pad(d.getMinutes()) + ':' + pad(d.getSeconds())
}
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
  // 计算同一时段（同天±1小时）的已接受+待处理人数
  sameSlotCount(booking, all) {
    if (!booking.time) return 0
    const [h, m] = booking.time.split(':').map(Number)
    const minutes = h * 60 + m
    return all.filter(b =>
      b._id !== booking._id &&
      (b.status === 'accepted' || b.status === 'pending') &&
      b.date === booking.date &&
      b.time
    ).filter(b => {
      const [bh, bm] = b.time.split(':').map(Number)
      const bMinutes = bh * 60 + bm
      return Math.abs(bMinutes - minutes) <= 60
    }).length
  },

  applyFilter() {
    const idx = this.data.filterIdx
    let displayList = this.data.list
    if (idx === 1) displayList = displayList.filter(b => b.status === 'pending')
    else if (idx === 2) displayList = displayList.filter(b => b.status === 'accepted')
    else if (idx === 3) displayList = displayList.filter(b => b.status === 'rejected')
    // 计算同时间段人数
    const all = this.data.list
    displayList = displayList.map(b => ({
      ...b,
      sameSlotCount: this.sameSlotCount(b, all)
    }))
    this.setData({ displayList })
  },
  onFilter(e) {
    this.setData({ filterIdx: parseInt(e.detail.value) })
    this.applyFilter()
  },
  async acceptBooking(e) {
    wx.showLoading({ title: '处理中...' })
    const bookingId = e.currentTarget.dataset.id
    await cloud.handleBooking(bookingId, 'accepted')
    wx.hideLoading()
    wx.showToast({ title: '已接受' })
    // 通知学员（使用同一模板）
    const booking = this.data.list.find(b => b._id === bookingId)
    if (booking) {
      const nr = await cloud.sendNotify({
        openid: booking.openid,
        templateId: '0TTCrbD9ZDJTjouXteF5BXoeZZxV2mgG461In1BkPYo',
        page: 'pages/student/my-bookings/index',
        data: {
          thing1: { value: booking.subject },
          phrase2: { value: '已接受' },
          time3: { value: fmtTime(new Date()) }
        }
      })
      if (nr.code !== 0) wx.showToast({ title: '通知失败: ' + (nr.msg || ''), icon: 'none' })
    }
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
          const bookingId = e.currentTarget.dataset.id
          await cloud.handleBooking(bookingId, 'rejected', res.content)
          wx.hideLoading()
          wx.showToast({ title: '已拒绝' })
          // 通知学员（使用同一模板）
          const booking = this.data.list.find(b => b._id === bookingId)
          if (booking) {
            const nr = await cloud.sendNotify({
              openid: booking.openid,
              templateId: '0TTCrbD9ZDJTjouXteF5BXoeZZxV2mgG461In1BkPYo',
              page: 'pages/student/my-bookings/index',
              data: {
                thing1: { value: booking.subject },
                phrase2: { value: '已拒绝' },
                time3: { value: fmtTime(new Date()) }
              }
            })
            if (nr.code !== 0) wx.showToast({ title: '通知失败: ' + (nr.msg || ''), icon: 'none' })
          }
          this.load()
        }
      }
    })
  },
  callPhone(e) { wx.makePhoneCall({ phoneNumber: e.currentTarget.dataset.phone }) }
,onShareAppMessage(){},onShareTimeline(){}})
