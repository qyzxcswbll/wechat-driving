const cloud = require('../../../utils/cloud')
const NAV_ITEMS = [
  { key: 'home', icon: '📊', label: '首页', url: '../home/index' },
  { key: 'visits', icon: '🙋', label: '咨询', url: '../visits/index' },
  { key: 'bookings', icon: '📋', label: '预约', url: '../bookings/index' },
  { key: 'schedule', icon: '📅', label: '课程', url: '../schedule/index' }
]
const DOWS = ['日', '一', '二', '三', '四', '五', '六']
const MONTHS = ['一月','二月','三月','四月','五月','六月','七月','八月','九月','十月','十一月','十二月']

Page({
  data: {
    scheduleMap: {}, days: [], weekLabel: '', selectedDate: '', pickerDate: '',
    groupedSchedule: [], showModal: false, modalData: {}, navItems: NAV_ITEMS,
    scrollLeft: 0
  },
  onShow() { this.loadSchedule() },
  async loadSchedule() {
    const res = await cloud.getSchedule()
    if (res.code === 0) {
      this.setData({ scheduleMap: res.data })
      this.renderWeek(0)
    }
  },
  renderWeek(offsetDays) {
    // offsetDays: 从今天偏移的天数（用于点"选择月份"后跳转）
    const today = new Date()
    const todayStr = this.dateStr(today)
    const startDay = new Date(today)
    startDay.setDate(today.getDate() + offsetDays)

    const days = []
    for (let i = 0; i < 7; i++) {
      const d = new Date(startDay)
      d.setDate(startDay.getDate() + i)
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
    const weekLabel = days[0].date + ' - ' + days[6].date
    this.setData({
      days, weekLabel, selectedDate: activeDate,
      groupedSchedule: this.buildGrouped(this.data.scheduleMap[activeDate] || []),
      dayTotal: (this.data.scheduleMap[activeDate] || []).length
    })
  },
  buildGrouped(schedule) {
    const groups = {}
    schedule.forEach(item => {
      const key = item.time || '00:00'
      if (!groups[key]) groups[key] = []
      groups[key].push(item)
    })
    return Object.keys(groups).sort().map(time => ({
      time,
      students: groups[time]
    }))
  },
  selectDay(e) {
    const date = e.currentTarget.dataset.date
    this.setData({
      selectedDate: date,
      groupedSchedule: this.buildGrouped(this.data.scheduleMap[date] || []),
      dayTotal: (this.data.scheduleMap[date] || []).length
    })
    // 高亮选中日期
    const days = this.data.days.map(d => ({ ...d, active: d.date === date }))
    this.setData({ days })
  },
  // 选择月份：用微信自带 picker
  onMonthPick(e) {
    const picked = new Date(e.detail.value)
    const today = new Date()
    const diffDays = Math.floor((picked - today) / (1000 * 60 * 60 * 24))
    this.setData({ selectedDate: this.dateStr(picked), pickerDate: e.detail.value })
    this.renderWeek(diffDays)
    // 滚动到选中日期
    setTimeout(() => {
      const idx = this.data.days.findIndex(d => d.active)
      if (idx > -1) this.setData({ scrollLeft: Math.max(0, idx * 116 - 60) })
    }, 100)
  },
  showDetail(e) {
    this.setData({ showModal: true, modalData: e.currentTarget.dataset.item })
  },
  callStudent(e) {
    const phone = e.currentTarget.dataset.phone
    if (phone) wx.makePhoneCall({ phoneNumber: phone })
  },
  closeModal() { this.setData({ showModal: false }) },
  stopProp() {},
  dateStr(d) {
    return d.getFullYear() + '-' + String(d.getMonth()+1).padStart(2,'0') + '-' + String(d.getDate()).padStart(2,'0')
  }
})
