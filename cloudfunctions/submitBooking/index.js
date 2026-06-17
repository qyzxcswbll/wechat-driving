const cloud = require('wx-server-sdk')
cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV })
const db = cloud.database()

exports.main = async (event) => {
  const { OPENID } = cloud.getWXContext()
  const { bookings } = event

  if (!bookings || bookings.length === 0) return { code: -1, msg: '请至少选择一个日期' }

  // 保存学员的联系方式到学员档案
  if (event.phone) {
    try {
      const studentRes = await db.collection('students').where({ openid: OPENID }).get()
      if (studentRes.data.length > 0) {
        await db.collection('students').doc(studentRes.data[0]._id).update({
          data: {
            phone: event.phone,
            studentName: event.studentName || '',
            gender: event.gender || '先生',
            lastVisit: db.serverDate()
          }
        })
      }
    } catch (e) {
      console.error('更新学员档案失败', e)
    }
  }

  const ids = []
  for (const b of bookings) {
    const result = await db.collection('bookings').add({
      data: {
        openid: OPENID,
        nickName: event.nickName || '',
        studentName: event.studentName || '',
        gender: event.gender || '先生',
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
