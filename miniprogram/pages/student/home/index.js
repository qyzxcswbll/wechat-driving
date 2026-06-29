const cloud = require('../../../utils/cloud')
const NAV_ITEMS = [
  { key: 'home', icon: '🏠', label: '首页', url: '../home/index' },
  { key: 'booking', icon: '📅', label: '预约', url: '../booking/index' },
  { key: 'my', icon: '📍', label: '我的', url: '../my-bookings/index' },
  { key: 'contact', icon: '💬', label: '联系', url: '../contact/index' }
]

Page({
  data: { schoolInfo: {}, navItems: NAV_ITEMS },
  onLoad() {
    cloud.getSchoolInfo().then(res => {
      if (res.code === 0) {
        this.setData({ schoolInfo: res.data })
        if (res.data.schoolName) wx.setNavigationBarTitle({ title: res.data.schoolName })
      }
    })
  },
  goTo(e) { wx.navigateTo({ url: e.currentTarget.dataset.url }) },
  goSetup() { wx.navigateTo({ url: '/pages/setup/index' }) }
,onShareAppMessage(){},onShareTimeline(){}})
