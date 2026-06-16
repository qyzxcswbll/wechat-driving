const cloud = require('wx-server-sdk')
cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV })
const db = cloud.database()

exports.main = async (event) => {
  const { visitId } = event
  await db.collection('visits').doc(visitId).update({
    data: { status: 'contacted' }
  })
  return { code: 0, msg: '已标记' }
}
