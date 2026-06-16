const cloud = require('wx-server-sdk')
cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV })
const db = cloud.database()

exports.main = async () => {
  const res = await db.collection('bookings')
    .where({ status: 'accepted' })
    .orderBy('date', 'asc')
    .orderBy('createdAt', 'asc')
    .get()
  const schedule = {}
  res.data.forEach(b => {
    if (!schedule[b.date]) schedule[b.date] = []
    schedule[b.date].push(b)
  })
  return { code: 0, data: schedule }
}
