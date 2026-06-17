const cloud = require('../../utils/cloud')

Page({
  data: {
    authed: false,
    password: '',
    students: [],
    setMsg: '',
    saveMsg: '',
    form: { name: '', phone: '', schoolName: '', address: '', intro: '', wechatQR: '' }
  },
  onPwdInput(e) { this.setData({ password: e.detail.value }) },
  onFormInput(e) {
    const field = e.currentTarget.dataset.field
    this.setData({ ['form.' + field]: e.detail.value })
  },
  async verifyPwd() {
    if (!this.data.password) return wx.showToast({ title: '请输入密码', icon: 'none' })
    wx.showLoading({ title: '验证中...' })
    const res = await cloud.setupVerify(this.data.password)
    wx.hideLoading()
    if (res.code === 0) {
      this.setData({ authed: true })
      this.loadStudents()
    } else {
      wx.showToast({ title: '密码错误', icon: 'none' })
    }
  },
  async loadStudents() {
    const res = await cloud.setupGetAllStudents()
    if (res.code === 0) this.setData({ students: res.data })
  },
  async setAsAdmin(e) {
    const openid = e.currentTarget.dataset.openid
    wx.showLoading({ title: '设置中...' })
    const res = await cloud.setupSetAdmin(openid)
    wx.hideLoading()
    this.setData({ setMsg: res.msg })
    if (res.code === 0) wx.showToast({ title: '设置成功' })
  },
  async chooseImage() {
    wx.chooseImage({
      count: 1,
      success: (res) => {
        const filePath = res.tempFilePaths[0]
        wx.showLoading({ title: '上传中...' })
        wx.cloud.uploadFile({
          cloudPath: 'wechat-qr-' + Date.now() + '.jpg',
          filePath,
          success: (uploadRes) => {
            this.setData({ 'form.wechatQR': uploadRes.fileID })
            wx.hideLoading()
            wx.showToast({ title: '上传成功' })
          },
          fail: () => {
            wx.hideLoading()
            wx.showToast({ title: '上传失败', icon: 'none' })
          }
        })
      }
    })
  },
  async saveSchool() {
    wx.showLoading({ title: '保存中...' })
    const res = await cloud.setupUpdateSchool(this.data.form)
    wx.hideLoading()
    this.setData({ saveMsg: res.msg })
    if (res.code === 0) wx.showToast({ title: '已保存' })
  }
})
