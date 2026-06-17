const cloud = require('wx-server-sdk')
cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV })
const db = cloud.database()

exports.main = async () => {
  try {
    const { OPENID } = cloud.getWXContext()
    const res = await db.collection('visits')
      .where({ openid: OPENID })
      .orderBy('createdAt', 'desc')
      .get()
    return { code: 0, data: res.data }
  } catch (e) {
    return { code: -1, msg: e.message }
  }
}
