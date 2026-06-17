const cloud = require('wx-server-sdk')
cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV })
const db = cloud.database()

exports.main = async (event) => {
  const { OPENID } = cloud.getWXContext()
  const { bookings } = event

  if (!bookings || bookings.length === 0) return { code: -1, msg: '请至少选择一个日期' }

  const ids = []
  for (const b of bookings) {
    const result = await db.collection('bookings').add({
      data: {
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
      }
    })
    ids.push(result._id)
  }
  return { code: 0, data: { ids } }
}
