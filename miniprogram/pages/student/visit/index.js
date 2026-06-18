const cloud = require('../../../utils/cloud')
const app = getApp()
Page({
  data: { nickName: '', studentName: '', gender: '先生', phone: '', remark: '' },
  onLoad() {
    const ui = app.globalData.userInfo
    if (ui) {
      this.setData({
        nickName: ui.nickName || '',
        studentName: ui.studentName || '',
        gender: ui.gender || '先生',
        phone: ui.phone || ''
      })
    }
  },
  setGender(e) { this.setData({ gender: e.currentTarget.dataset.val }) },
  onNameInput(e) { this.setData({ studentName: e.detail.value }) },
  onPhoneInput(e) { this.setData({ phone: e.detail.value }) },
  onRemarkInput(e) { this.setData({ remark: e.detail.value }) },
  submit() {
    if (!this.data.studentName) return wx.showToast({ title: '请输入称呼', icon: 'none' })
    if (!this.data.phone) return wx.showToast({ title: '请输入手机号', icon: 'none' })

    // 先弹通知授权（如果之前没授权，这里可再次授权）
    wx.requestSubscribeMessage({
      tmplIds: ['0TTCrbD9ZDJTjouXteF5BXoeZZxV2mgG461In1BkPYo'],
      complete: async () => {
        wx.showLoading({ title: '提交中...' })
        const res = await cloud.submitVisit({
          nickName: this.data.nickName,
          studentName: this.data.studentName,
          gender: this.data.gender,
          phone: this.data.phone,
          remark: this.data.remark
        })
        wx.hideLoading()
        if (res.code === 0) {
          const ui = app.globalData.userInfo || {}
          app.globalData.userInfo = {
            ...ui,
            studentName: this.data.studentName,
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
})
