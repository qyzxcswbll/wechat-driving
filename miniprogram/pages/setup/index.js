const cloud = require('../../utils/cloud')

Page({
  data: {
    authed: false, showQrModal: false,
    password: '',
    students: [], studentTotal: 0, studentOffset: 0,
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
      this.loadSchoolInfo()
    } else {
      wx.showToast({ title: '密码错误', icon: 'none' })
    }
  },
  async loadStudents() {
    const [sRes, aRes] = await Promise.all([
      cloud.setupGetAllStudents({ limit: 20, offset: 0 }),
      cloud.setupGetAdmins()
    ])
    if (sRes.code === 0) {
      const adminOpenids = (aRes.code === 0 ? aRes.data : []).map(a => a.openid)
      const students = sRes.data.map(s => ({ ...s, isAdmin: adminOpenids.includes(s.openid) }))
      this.setData({ students, studentTotal: sRes.total, studentOffset: 20 })
    }
  },
  async loadMoreStudents() {
    wx.showLoading({ title: '加载中...' })
    const [sRes, aRes] = await Promise.all([
      cloud.setupGetAllStudents({ limit: 20, offset: this.data.studentOffset }),
      cloud.setupGetAdmins()
    ])
    wx.hideLoading()
    if (sRes.code === 0) {
      const adminOpenids = (aRes.code === 0 ? aRes.data : []).map(a => a.openid)
      const more = sRes.data.map(s => ({ ...s, isAdmin: adminOpenids.includes(s.openid) }))
      this.setData({
        students: [...this.data.students, ...more],
        studentOffset: this.data.studentOffset + 20
      })
    }
  },
  async loadMoreStudents() {
    wx.showLoading({ title: '加载中...' })
    const res = await cloud.setupGetAllStudents({ limit: 20, offset: this.data.studentOffset })
    wx.hideLoading()
    if (res.code === 0) {
      this.setData({
        students: [...this.data.students, ...res.data],
        studentOffset: this.data.studentOffset + 20
      })
    }
  },
  async loadSchoolInfo() {
    const res = await cloud.getSchoolInfo()
    if (res.code === 0 && res.data) {
      this.setData({
        form: {
          name: res.data.coachName || '',
          phone: res.data.phone || '',
          schoolName: res.data.schoolName || '',
          address: res.data.address || '',
          intro: res.data.intro || '',
          wechatQR: res.data.wechatQR || ''
        }
      })
    }
  },
  async setAsAdmin(e) {
    const openid = e.currentTarget.dataset.openid
    const student = this.data.students.find(s => s.openid === openid)
    wx.showLoading({ title: '设置中...' })
    const res = await cloud.setupSetAdmin(openid)
    wx.hideLoading()
    this.setData({ setMsg: res.msg })
    if (res.code === 0) {
      wx.showToast({ title: '设置成功' })
      // 自动填充已知信息到表单
      if (student) {
        this.setData({
          form: {
            ...this.data.form,
            name: student.studentName || student.nickName || '教练',
            phone: student.phone || ''
          }
        })
      }
    }
  },
  async removeAdmin(e) {
    const openid = e.currentTarget.dataset.openid
    const name = e.currentTarget.dataset.name
    wx.showModal({
      title: '取消教练权限',
      content: `确定将「${name}」取消教练身份吗？`,
      success: async (res) => {
        if (res.confirm) {
          wx.showLoading({ title: '处理中...' })
          const result = await cloud.setupRemoveAdmin(openid)
          wx.hideLoading()
          this.setData({ setMsg: result.msg })
          if (result.code === 0) {
            wx.showToast({ title: '已取消' })
            this.loadStudents()
          } else {
            wx.showToast({ title: result.msg, icon: 'none' })
          }
        }
      }
    })
  },
  showQrGuide() { this.setData({ showQrModal: true }) },
  closeQrGuide() { this.setData({ showQrModal: false }) },
  stopProp() {},
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
