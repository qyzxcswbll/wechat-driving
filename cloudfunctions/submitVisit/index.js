const cloud = require('wx-server-sdk')
cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV })
const db = cloud.database()

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
  return { code: 0, data: { visitId: result._id } }
}
