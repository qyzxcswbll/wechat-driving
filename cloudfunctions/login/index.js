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

  // 查找或创建学员记录
  let user = await students.where({ openid: OPENID }).get()
  if (user.data.length === 0) {
    const result = await students.add({
      data: {
        openid: OPENID,
        nickName: event.nickName || '',
        avatarUrl: event.avatarUrl || '',
        phone: event.phone || '',
        createdAt: db.serverDate(),
        lastVisit: db.serverDate()
      }
    })
    return { code: 0, data: { isAdmin: false, userInfo: { _id: result._id, openid: OPENID, nickName: event.nickName, avatarUrl: event.avatarUrl, phone: event.phone || '' } } }
  }

  // 更新最近访问
  await students.doc(user.data[0]._id).update({
    data: { lastVisit: db.serverDate(), nickName: event.nickName, avatarUrl: event.avatarUrl }
  })
  return { code: 0, data: { isAdmin: false, userInfo: user.data[0] } }
}
