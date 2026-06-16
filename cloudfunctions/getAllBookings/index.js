const cloud = require('wx-server-sdk')
cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV })
const db = cloud.database()

exports.main = async () => {
  const res = await db.collection('bookings')
    .orderBy('date', 'desc')
    .orderBy('createdAt', 'desc')
    .get()
  return { code: 0, data: res.data }
}
