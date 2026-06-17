const cloud = require('wx-server-sdk')
cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV })

// 默认管理密码（上线后请修改）
const SETUP_PASSWORD = '888888'

exports.main = async (event) => {
  if (event.password === SETUP_PASSWORD) {
    return { code: 0, msg: '验证通过' }
  }
  return { code: -1, msg: '密码错误' }
}
