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
    scheduleMap: {}, weekDays: [], weekLabel: '', selectedDate: '',
    daySchedule: [], weekOffset: 0, navItems: NAV_ITEMS
  },
  onShow() { this.loadSchedule() },
  async loadSchedule() {
    const res = await cloud.getSchedule()
    if (res.code === 0) {
      this.setData({ scheduleMap: res.data })
      this.renderWeek()
    }
  },
  renderWeek() {
    const now = new Date()
    now.setDate(now.getDate() + this.data.weekOffset * 7)
    const startOfWeek = new Date(now)
    startOfWeek.setDate(now.getDate() - now.getDay())

    const days = []
    const todayStr = this.dateStr(new Date())
    for (let i = 0; i < 7; i++) {
      const d = new Date(startOfWeek)
      d.setDate(startOfWeek.getDate() + i)
      const dateStr = this.dateStr(d)
      days.push({
        date: dateStr,
        dow: DOWS[d.getDay()],
        day: String(d.getDate()).padStart(2, '0'),
        isToday: dateStr === todayStr,
        active: dateStr === this.data.selectedDate || (!this.data.selectedDate && d.getDay() === now.getDay())
      })
    }

    const activeDay = days.find(d => d.active) || days[0]
    const weekLabel = days[0].date + ' ~ ' + days[6].date
    this.setData({
      weekDays: days, weekLabel,
      selectedDate: activeDay.date,
      daySchedule: this.data.scheduleMap[activeDay.date] || []
    })
  },
  selectDay(e) {
    const date = e.currentTarget.dataset.date
    this.setData({
      selectedDate: date,
      daySchedule: this.data.scheduleMap[date] || []
    })
    this.renderWeek()
  },
  prevWeek() {
    this.setData({ weekOffset: this.data.weekOffset - 1 })
    this.renderWeek()
  },
  nextWeek() {
    this.setData({ weekOffset: this.data.weekOffset + 1 })
    this.renderWeek()
  },
  dateStr(d) {
    const y = d.getFullYear()
    const m = String(d.getMonth() + 1).padStart(2, '0')
    const day = String(d.getDate()).padStart(2, '0')
    return y + '-' + m + '-' + day
  }
})
