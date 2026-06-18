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

  // 通知教练
  try {
    const adminRes = await db.collection('admins').limit(1).get()
    if (adminRes.data.length > 0) {
      const admin = adminRes.data[0]
      await cloud.openapi.subscribeMessage.send({
        touser: admin.openid,
        templateId: '0TTCrbD9ZDJTjouXteF5BXoeZZxV2mgG461In1BkPYo',
        page: 'pages/admin/bookings/index',
        data: {
          thing1: { value: '学员取消预约' },
          phrase2: { value: '已取消' },
          time3: { value: fmtTime(new Date()) }
        }
      })
    }
  } catch (e) {
    console.error('通知教练失败', e)
  }

  return { code: 0, msg: '已取消' }
}

function fmtTime(d) {
  const pad = n => String(n).padStart(2, '0')
  return d.getFullYear() + '-' + pad(d.getMonth()+1) + '-' + pad(d.getDate()) + ' ' + pad(d.getHours()) + ':' + pad(d.getMinutes()) + ':' + pad(d.getSeconds())
}
