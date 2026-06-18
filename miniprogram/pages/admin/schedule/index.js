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
    scheduleMap: {}, days: [], monthLabel: '', selectedDate: '',
    groupedSchedule: [], showModal: false, modalData: {}, navItems: NAV_ITEMS,
    scrollLeft: 0
  },
  onShow() { this.loadSchedule() },
  async loadSchedule() {
    const res = await cloud.getSchedule()
    if (res.code === 0) {
      this.setData({ scheduleMap: res.data })
      this.renderDays(0)
    }
  },
  renderDays(offset) {
    // offset: 0=今天开始, >0往后推N天（用于滚动加载）
    const today = new Date()
    const todayStr = this.dateStr(today)
    const startDay = new Date(today)
    startDay.setDate(today.getDate() + offset)

    const days = []
    // 生成30天
    for (let i = 0; i < 30; i++) {
      const d = new Date(startDay)
      d.setDate(startDay.getDate() + i)
      const dateStr = this.dateStr(d)
      const daySchedule = this.data.scheduleMap[dateStr] || []
      days.push({
        date: dateStr,
        dow: DOWS[d.getDay()],
        day: String(d.getDate()).padStart(2, '0'),
        month: d.getMonth() + 1,
        isToday: dateStr === todayStr,
        active: dateStr === (this.data.selectedDate || todayStr),
        count: daySchedule.length
      })
    }

    const firstDay = days[0]
    const lastDay = days[days.length - 1]
    const monthLabel = firstDay.month === lastDay.month
      ? firstDay.month + '月'
      : firstDay.month + '-' + lastDay.month + '月'

    const activeDate = this.data.selectedDate || todayStr
    const rawSchedule = this.data.scheduleMap[activeDate] || []

    // 按时间分组
    const timeGroups = {}
    rawSchedule.forEach(item => {
      const key = item.time || '00:00'
      if (!timeGroups[key]) timeGroups[key] = []
      timeGroups[key].push(item)
    })
    const groupedSchedule = Object.keys(timeGroups).sort().map(time => ({
      time,
      students: timeGroups[time]
    }))

    this.setData({
      days, monthLabel,
      selectedDate: activeDate,
      groupedSchedule
    })
  },
  onDateScroll(e) {
    // 滚动到边缘时加载更多
    const scrollLeft = e.detail.scrollLeft
    const scrollWidth = e.detail.scrollWidth
    const clientWidth = e.detail.clientWidth
    // 如果快要滚到底，往前加载更多（这里暂不实现动态加载，30天够用）
  },
  selectDay(e) {
    const date = e.currentTarget.dataset.date
    this.setData({ selectedDate: date })
    this.renderDays(0)

    // 自动滚动到选中日期可见
    const idx = this.data.days.findIndex(d => d.date === date)
    if (idx > -1) {
      this.setData({ scrollLeft: Math.max(0, idx * 120 - 80) })
    }
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
