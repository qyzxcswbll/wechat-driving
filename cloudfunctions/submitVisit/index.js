const cloud = require('wx-server-sdk')
cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV })
const db = cloud.database()

exports.main = async (event) => {
  const { OPENID } = cloud.getWXContext()
  const { phone, remark } = event
  if (!phone) return { code: -1, msg: '手机号不能为空' }

  const result = await db.collection('visits').add({
    data: {
      openid: OPENID,
      nickName: event.nickName || '',
      phone,
      remark: remark || '',
      status: 'pending',
      createdAt: db.serverDate()
    }
  })
  return { code: 0, data: { visitId: result._id } }
}
