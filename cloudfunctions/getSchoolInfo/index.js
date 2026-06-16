const cloud = require('wx-server-sdk')
cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV })
const db = cloud.database()

exports.main = async () => {
  const res = await db.collection('admins').limit(1).get()
  if (res.data.length === 0) return { code: -1, msg: '未找到驾校信息' }
  const admin = res.data[0]
  return {
    code: 0,
    data: {
      schoolName: admin.schoolName,
      address: admin.address,
      intro: admin.intro,
      coachName: admin.name,
      phone: admin.phone,
      wechatQR: admin.wechatQR
    }
  }
}
