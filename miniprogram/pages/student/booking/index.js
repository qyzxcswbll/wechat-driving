const cloud = require('../../../utils/cloud')
const app = getApp()

Page({
  data: {
    subject: '科目二',
    gear: '自动挡',
    remark: '',
    slots: [{ date: '', time: '', remark: '' }],
    studentName: '',
    nickName: '',
    phone: ''
  },
  onLoad() {
    const ui = app.globalData.userInfo
    if (ui) {
      this.setData({
        nickName: ui.nickName || '',
        phone: ui.phone || '',
        studentName: ui.studentName || ''
      })
    }
  },
  setSubject(e) { this.setData({ subject: e.currentTarget.dataset.val }) },
  setGear(e) { this.setData({ gear: e.currentTarget.dataset.val }) },
  onNameInput(e) { this.setData({ studentName: e.detail.value }) },
  onPhoneInput(e) { this.setData({ phone: e.detail.value }) },
  onRemarkInput(e) { this.setData({ remark: e.detail.value }) },
  onTimeChange(e) {
    const idx = e.currentTarget.dataset.index
    this.setData({ ['slots[' + idx + '].time']: e.detail.value })
  },
  onSlotRemark(e) {
    const idx = e.currentTarget.dataset.index
    this.setData({ ['slots[' + idx + '].remark']: e.detail.value })
  },
  onDateChange(e) {
    const idx = e.currentTarget.dataset.index
    this.setData({ ['slots[' + idx + '].date']: e.detail.value })
  },
  addSlot() {
    const slots = [...this.data.slots, { date: '', time: '', remark: '' }]
    this.setData({ slots })
  },
  removeSlot(e) {
    const idx = e.currentTarget.dataset.index
    const slots = this.data.slots.filter((_, i) => i !== idx)
    this.setData({ slots })
  },
  async submit() {
    if (!this.data.studentName) return wx.showToast({ title: '请输入姓名', icon: 'none' })
    if (!this.data.phone) return wx.showToast({ title: '请输入手机号', icon: 'none' })
    const validSlots = this.data.slots.filter(s => s.date && s.time)
    if (validSlots.length === 0) {
      return wx.showToast({ title: '请至少填写一个日期和时间', icon: 'none' })
    }
    wx.showLoading({ title: '提交中...' })
    const gearText = this.data.gear
    const bookings = validSlots.map(s => ({
      date: s.date, time: s.time,
      subject: this.data.subject,
      remark: (s.remark || this.data.remark) ? (s.remark || this.data.remark) + ' · ' + gearText : gearText
    }))
    const res = await cloud.submitBooking({
      nickName: this.data.nickName,
      studentName: this.data.studentName,
      phone: this.data.phone,
      bookings
    })
    wx.hideLoading()
    if (res.code === 0) {
      wx.requestSubscribeMessage({
        tmplIds: [],
        complete: () => {
          wx.showToast({ title: '成功提交' + validSlots.length + '节预约' })
          setTimeout(() => wx.navigateBack(), 1500)
        }
      })
    } else {
      wx.showToast({ title: res.msg || '提交失败', icon: 'none' })
    }
  }
})
