const cloud = require('wx-server-sdk')
cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV })
const db = cloud.database()

exports.main = async (event) => {
  const { OPENID } = cloud.getWXContext()
  const { bookingId } = event

  // 只允许取消自己的预约
  const booking = await db.collection('bookings').doc(bookingId).get()
  if (!booking.data) return { code: -1, msg: '预约不存在' }
  if (booking.data.openid !== OPENID) return { code: -1, msg: '只能取消自己的预约' }
  if (booking.data.status !== 'pending') return { code: -1, msg: '只能取消待确认的预约' }

  await db.collection('bookings').doc(bookingId).update({
    data: {
      status: 'cancelled',
      adminReply: '学员已取消',
      updatedAt: db.serverDate()
    }
  })
  return { code: 0, msg: '已取消' }
}
