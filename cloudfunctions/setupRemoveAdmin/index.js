// 云函数：取消管理员（教练）权限
const cloud = require('wx-server-sdk')
cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV })
const db = cloud.database()

exports.main = async (event) => {
  const { openid } = event
  if (!openid) return { code: -1, msg: '请选择学员' }

  try {
    const existing = await db.collection('admins').where({ openid }).get()
    if (existing.data.length === 0) return { code: -1, msg: '该学员不是管理员' }

    await db.collection('admins').where({ openid }).remove()
    return { code: 0, msg: '已取消教练权限' }
  } catch (e) {
    console.error('setupRemoveAdmin 失败', e)
    return { code: -1, msg: '操作失败: ' + e.message }
  }
}
