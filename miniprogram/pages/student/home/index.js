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
  goSetup() { wx.navigateTo({ url: '/pages/setup/index' }) },
  openMap() {
    const info = this.data.schoolInfo
    if (!info.latitude || !info.longitude) return wx.showToast({ title: '教练暂未设置位置', icon: 'none' })
    wx.openLocation({
      latitude: Number(info.latitude),
      longitude: Number(info.longitude),
      name: info.schoolName || '驾校',
      address: info.address || '',
      fail: () => wx.showToast({ title: '位置信息异常，请重新设置坐标', icon: 'none' })
    })
  }
,
  onShareAppMessage(){return{title:"轻松上路 - 一键预约学车"}},
  onShareTimeline(){return{title:"轻松上路 - 一键预约学车"}}
})
