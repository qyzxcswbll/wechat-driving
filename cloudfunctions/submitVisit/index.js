const cloud = require('wx-server-sdk')
cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV })
const db = cloud.database()

function fmtTime(d) {
  const pad = n => String(n).padStart(2, '0')
  return d.getFullYear() + '-' + pad(d.getMonth()+1) + '-' + pad(d.getDate()) + ' ' + pad(d.getHours()) + ':' + pad(d.getMinutes()) + ':' + pad(d.getSeconds())
}

exports.main = async (event) => {
  const { OPENID } = cloud.getWXContext()
  const { phone, remark } = event
  if (!phone) return { code: -1, msg: '手机号不能为空' }

  // 保存学员联系方式到学员档案
  try {
    const studentRes = await db.collection('students').where({ openid: OPENID }).get()
    if (studentRes.data.length > 0) {
      const updateData = { phone, lastVisit: db.serverDate() }
      if (event.studentName) updateData.studentName = event.studentName
      if (event.gender) updateData.gender = event.gender
      await db.collection('students').doc(studentRes.data[0]._id).update({ data: updateData })
    }
  } catch (e) {
    console.error('更新学员档案失败', e)
  }

  const result = await db.collection('visits').add({
    data: {
      openid: OPENID,
      nickName: event.nickName || '',
      studentName: event.studentName || '',
      gender: event.gender || '先生',
      phone,
      remark: remark || '',
      status: 'pending',
      createdAt: db.serverDate()
    }
  })

  // 通知教练
  let notifyResult = ''
  try {
    const adminRes = await db.collection('admins').limit(1).get()
    if (adminRes.data.length > 0) {
      const admin = adminRes.data[0]
      notifyResult = '找到管理员: ' + (admin.name || admin.openid)
      const sendRes = await cloud.openapi.subscribeMessage.send({
        touser: admin.openid,
        templateId: '0TTCrbD9ZDJTjouXteF5BXoeZZxV2mgG461In1BkPYo',
        page: 'pages/admin/visits/index',
        data: {
          thing1: { value: '参观咨询' },
          phrase2: { value: '待回复' },
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

  return { code: 0, data: { visitId: result._id }, notify: notifyResult }
}
