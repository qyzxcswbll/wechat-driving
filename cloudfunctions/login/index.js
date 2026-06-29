const cloud = require('wx-server-sdk')
cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV })
const db = cloud.database()
const admins = db.collection('admins')
const students = db.collection('students')

exports.main = async (event) => {
  const { OPENID } = cloud.getWXContext()
  if (!OPENID) return { code: -1, msg: '获取身份失败' }

  // 判断是否为管理员
  const adminRes = await admins.where({ openid: OPENID }).get()
  const isAdmin = adminRes.data.length > 0

  if (isAdmin) {
    return { code: 0, data: { isAdmin: true, userInfo: adminRes.data[0] } }
  }

  // 查找已有学员记录（不创建，等提交参观/预约时再建）
  const user = await students.where({ openid: OPENID }).get()
  if (user.data.length > 0) {
    // 更新最近访问
    await students.doc(user.data[0]._id).update({
      data: { lastVisit: db.serverDate(), nickName: event.nickName || '', avatarUrl: event.avatarUrl || '' }
    })
    return { code: 0, data: { isAdmin: false, userInfo: user.data[0] } }
  }

  // 纯登录不创建记录，返回基本身份信息
  return { code: 0, data: { isAdmin: false, userInfo: { openid: OPENID, nickName: '', avatarUrl: '', phone: '', studentName: '', gender: '先生' } } }
}
