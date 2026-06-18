const cloud = require('wx-server-sdk')
cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV })
const db = cloud.database()

exports.main = async (event) => {
  const { limit = 20, offset = 0 } = event
  const res = await db.collection('students')
    .orderBy('createdAt', 'desc')
    .skip(offset)
    .limit(limit)
    .get()
  // 获取总数
  const countRes = await db.collection('students').count()
  return { code: 0, data: res.data, total: countRes.total }
}
