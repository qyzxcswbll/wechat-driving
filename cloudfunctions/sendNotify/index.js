const cloud = require('wx-server-sdk')
cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV })

exports.main = async (event) => {
  const { openid, templateId, data, page } = event
  try {
    const result = await cloud.openapi.subscribeMessage.send({
      touser: openid,
      templateId,
      page: page || 'pages/student/home/index',
      data
    })
    return { code: 0, data: result }
  } catch (e) {
    return { code: -1, msg: e.message }
  }
}
