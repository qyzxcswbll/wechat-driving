const cloud = require('wx-server-sdk')
cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV })
const db = cloud.database()

exports.main = async (event) => {
  const { schoolName, address, intro, coachName, phone, wechatQR, wechatId, latitude, longitude } = event

  const adminRes = await db.collection('admins').limit(1).get()
  if (adminRes.data.length === 0) return { code: -1, msg: '请先设置管理员' }

  const updateData = {}
  if (schoolName) updateData.schoolName = schoolName
  if (address) updateData.address = address
  if (intro) updateData.intro = intro
  if (coachName) updateData.name = coachName
  if (phone) updateData.phone = phone
  if (wechatQR) updateData.wechatQR = wechatQR
  if (wechatId !== undefined) updateData.wechatId = wechatId
  if (latitude !== undefined) updateData.latitude = latitude
  if (longitude !== undefined) updateData.longitude = longitude

  await db.collection('admins').doc(adminRes.data[0]._id).update({
    data: updateData
  })
  return { code: 0, msg: '已更新' }
}
