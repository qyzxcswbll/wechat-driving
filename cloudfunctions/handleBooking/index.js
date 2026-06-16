const cloud = require('wx-server-sdk')
cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV })
const db = cloud.database()

exports.main = async (event) => {
  const { bookingId, action, adminReply } = event
  const updateData = {
    status: action,
    updatedAt: db.serverDate()
  }
  if (action === 'rejected' && adminReply) {
    updateData.adminReply = adminReply
  }
  await db.collection('bookings').doc(bookingId).update({ data: updateData })
  return { code: 0, msg: action === 'accepted' ? '已接受' : '已拒绝' }
}
