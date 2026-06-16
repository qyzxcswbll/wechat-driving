const cloud = require('wx-server-sdk')
cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV })
const db = cloud.database()

exports.main = async (event) => {
  const { OPENID } = cloud.getWXContext()
  const { bookings } = event

  if (!bookings || bookings.length === 0) return { code: -1, msg: '请至少选择一个日期' }

  const tasks = bookings.map(b => ({
    openid: OPENID,
    nickName: event.nickName || '',
    phone: event.phone || '',
    subject: b.subject,
    date: b.date,
    time: b.time,
    remark: b.remark || '',
    status: 'pending',
    adminReply: '',
    createdAt: db.serverDate(),
    updatedAt: db.serverDate()
  }))

  const result = await db.collection('bookings').add(tasks)
  return { code: 0, data: { ids: result._id || result } }
}
