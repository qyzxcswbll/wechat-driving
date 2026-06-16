const cloud = require('../../../utils/cloud')
const app = getApp()

Page({
  data: {
    subject: '科目二',
    remark: '',
    slots: [{ date: '', time: '', remark: '' }],
    nickName: '',
    phone: ''
  },
  onLoad() {
    const ui = app.globalData.userInfo
    if (ui) {
      this.setData({ nickName: ui.nickName || '', phone: ui.phone || '' })
    }
  },
  setSubject(e) { this.setData({ subject: e.currentTarget.dataset.val }) },
  onRemarkInput(e) { this.setData({ remark: e.detail.value }) },
  onTimeInput(e) {
    const idx = e.currentTarget.dataset.index
    this.setData({ ['slots[' + idx + '].time']: e.detail.value })
  },
  onSlotRemark(e) {
    const idx = e.currentTarget.dataset.index
    this.setData({ ['slots[' + idx + '].remark']: e.detail.value })
  },
  pickDate(e) {
    const idx = e.currentTarget.dataset.index
    const self = this
    wx.showDatePicker({
      success(res) {
        self.setData({ ['slots[' + idx + '].date']: res.date })
      }
    })
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
    const validSlots = this.data.slots.filter(s => s.date && s.time)
    if (validSlots.length === 0) {
      return wx.showToast({ title: '请至少填写一个日期和时间', icon: 'none' })
    }
    wx.showLoading({ title: '提交中...' })
    const bookings = validSlots.map(s => ({
      date: s.date, time: s.time,
      subject: this.data.subject,
      remark: s.remark || this.data.remark
    }))
    const res = await cloud.submitBooking({
      nickName: this.data.nickName,
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
