const cloud = require('../../../utils/cloud')
const NAV_ITEMS = [
  { key: 'home', icon: '📊', label: '首页', url: '../home/index' },
  { key: 'visits', icon: '🙋', label: '咨询', url: '../visits/index' },
  { key: 'bookings', icon: '📋', label: '预约', url: '../bookings/index' },
  { key: 'schedule', icon: '📅', label: '课程', url: '../schedule/index' }
]
const DOWS = ['日', '一', '二', '三', '四', '五', '六']

Page({
  data: {
    scheduleMap: {}, days: [], selectedDate: '', daySchedule: [],
    showModal: false, modalData: {}, navItems: NAV_ITEMS
  },
  onShow() { this.loadSchedule() },
  async loadSchedule() {
    const res = await cloud.getSchedule()
    if (res.code === 0) {
      this.setData({ scheduleMap: res.data })
      this.renderDays()
    }
  },
  renderDays() {
    const today = new Date()
    const todayStr = this.dateStr(today)
    const days = []
    for (let i = 0; i < 4; i++) {
      const d = new Date(today)
      d.setDate(today.getDate() + i)
      const dateStr = this.dateStr(d)
      const daySchedule = this.data.scheduleMap[dateStr] || []
      days.push({
        date: dateStr,
        dow: DOWS[d.getDay()],
        day: String(d.getDate()).padStart(2, '0'),
        isToday: dateStr === todayStr,
        active: dateStr === (this.data.selectedDate || todayStr),
        count: daySchedule.length
      })
    }
    const activeDate = this.data.selectedDate || todayStr
    this.setData({
      days,
      selectedDate: activeDate,
      daySchedule: this.data.scheduleMap[activeDate] || []
    })
  },
  selectDay(e) {
    const date = e.currentTarget.dataset.date
    this.setData({
      selectedDate: date,
      daySchedule: this.data.scheduleMap[date] || []
    })
    this.renderDays()
  },
  showDetail(e) {
    this.setData({ showModal: true, modalData: e.currentTarget.dataset.item })
  },
  closeModal() { this.setData({ showModal: false }) },
  stopProp() {},
  dateStr(d) {
    return d.getFullYear() + '-' + String(d.getMonth()+1).padStart(2,'0') + '-' + String(d.getDate()).padStart(2,'0')
  }
})
