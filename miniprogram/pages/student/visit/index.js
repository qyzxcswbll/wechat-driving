const cloud = require('../../../utils/cloud')
const app = getApp()
Page({
  data: { nickName: '', gender: '先生', phone: '', remark: '', agreed: false },
  onLoad() {
    const ui = app.globalData.userInfo
    if (ui) {
      this.setData({
        nickName: ui.nickName || ui.studentName || '',
        gender: ui.gender || '先生',
        phone: ui.phone || ''
      })
    }
  },
  setGender(e) { this.setData({ gender: e.currentTarget.dataset.val }) },
  onNameInput(e) { this.setData({ nickName: e.detail.value }) },
  onPhoneInput(e) { this.setData({ phone: e.detail.value }) },
  onRemarkInput(e) { this.setData({ remark: e.detail.value }) },
  togglePrivacy() { this.setData({ agreed: !this.data.agreed }) },
  openPrivacy() { wx.navigateTo({ url: '/pages/privacy/index' }) },

  submit() {
    if (!this.data.phone) return wx.showToast({ title: '请输入手机号', icon: 'none' })
    if (!this.data.agreed) return wx.showToast({ title: '请先阅读并同意隐私政策', icon: 'none' })

    const nickName = this.data.nickName || app.globalData.userInfo?.nickName || '学员'

    // 先弹通知授权
    wx.requestSubscribeMessage({
      tmplIds: ['0TTCrbD9ZDJTjouXteF5BXoeZZxV2mgG461In1BkPYo'],
      complete: async () => {
        wx.showLoading({ title: '提交中...' })
        const res = await cloud.submitVisit({
          nickName,
          studentName: nickName,
          gender: this.data.gender,
          phone: this.data.phone,
          remark: this.data.remark
        })
        wx.hideLoading()
        if (res.code === 0) {
          const ui = app.globalData.userInfo || {}
          app.globalData.userInfo = {
            ...ui,
            studentName: nickName,
            gender: this.data.gender,
            phone: this.data.phone
          }
          const notifyMsg = res.notify ? '\n通知: ' + res.notify : ''
          wx.showModal({
            title: '提交成功',
            content: '参观申请已提交' + notifyMsg,
            showCancel: false,
            success: () => setTimeout(() => wx.navigateBack(), 500)
          })
        } else {
          wx.showToast({ title: res.msg || '提交失败', icon: 'none' })
        }
      }
    })
  }
,onShareAppMessage(){},onShareTimeline(){}})
