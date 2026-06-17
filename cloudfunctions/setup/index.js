const cloud = require('wx-server-sdk')
cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV })
const db = cloud.database()

exports.main = async () => {
  const results = []
  const collections = ['students', 'admins', 'visits', 'bookings']

  for (const name of collections) {
    try {
      await db.createCollection(name)
      results.push({ collection: name, status: 'created' })
    } catch (e) {
      results.push({ collection: name, status: '已存在或创建失败', msg: e.message })
    }
  }

  // 尝试创建 students 集合 openid 唯一索引
  try {
    const db = cloud.database()
    // 通过 createIndexes API 创建索引（需要 wx-server-sdk 支持）
    results.push({ note: '索引请在云开发控制台手动创建：students.openid(唯一), bookings.openid/status/date(升序)' })
  } catch (e) {
    results.push({ note: '索引请在云开发控制台手动创建' })
  }

  return { code: 0, data: results }
}
