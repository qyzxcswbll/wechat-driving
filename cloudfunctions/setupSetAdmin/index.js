const cloud = require('wx-server-sdk')
cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV })
const db = cloud.database()

exports.main = async (event) => {
  const { openid } = event
  if (!openid) return { code: -1, msg: '请选择学员' }

  // 检查是否已经是管理员
  const existing = await db.collection('admins').where({ openid }).get()
  if (existing.data.length > 0) return { code: 0, msg: '该学员已是管理员' }

  // 获取学员信息
  const student = await db.collection('students').where({ openid }).get()
  if (student.data.length === 0) return { code: -1, msg: '学员不存在' }

  // 创建管理员记录
  await db.collection('admins').add({
    data: {
      openid,
      name: student.data[0].studentName || student.data[0].nickName || '教练',
      phone: student.data[0].phone || '',
      schoolName: '平安驾校',
      address: '',
      intro: '',
      wechatQR: ''
    }
  })
  return { code: 0, msg: '已设为管理员' }
}
