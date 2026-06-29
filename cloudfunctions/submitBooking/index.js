const cloud = require('wx-server-sdk')
cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV })
const db = cloud.database()

function fmtTime(d) {
  const pad = n => String(n).padStart(2, '0')
  return d.getFullYear() + '-' + pad(d.getMonth()+1) + '-' + pad(d.getDate()) + ' ' + pad(d.getHours()) + ':' + pad(d.getMinutes()) + ':' + pad(d.getSeconds())
}

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
            nickName: event.nickName || '',
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

  // 通知教练
  let notifyResult = ''
  try {
    const adminRes = await db.collection('admins').limit(1).get()
    if (adminRes.data.length > 0) {
      const admin = adminRes.data[0]
      const first = bookings[0]
      notifyResult = '找到管理员: ' + (admin.name || admin.openid)
      const sendRes = await cloud.openapi.subscribeMessage.send({
        touser: admin.openid,
        templateId: '0TTCrbD9ZDJTjouXteF5BXoeZZxV2mgG461In1BkPYo',
        page: 'pages/admin/bookings/index',
        data: {
          thing1: { value: first.subject + ' 预约' },
          phrase2: { value: '待处理' },
          time3: { value: fmtTime(new Date()) }
        }
      })
      notifyResult += ' | 发送成功'
    } else {
      notifyResult = '未找到管理员记录'
    }
  } catch (e) {
    notifyResult = '发送失败: ' + e.message
    console.error('通知教练失败', e)
  }

  return { code: 0, data: { ids }, notify: notifyResult }
}
