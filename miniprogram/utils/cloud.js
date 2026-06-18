const call = (name, data) => {
  return wx.cloud.callFunction({ name, data })
    .then(res => res.result)
    .catch(err => { console.error(name, err); return { code: -1, msg: '网络错误' } })
}

module.exports = {
  login: (data) => call('login', data),
  getSchoolInfo: () => call('getSchoolInfo'),
  submitVisit: (data) => call('submitVisit', data),
  getVisits: () => call('getVisits'),
  markContacted: (id) => call('markContacted', { visitId: id }),
  submitBooking: (data) => call('submitBooking', data),
  getMyBookings: () => call('getMyBookings'),
  getMyVisits: () => call('getMyVisits'),
  getAllBookings: () => call('getAllBookings'),
  handleBooking: (id, action, reply) => call('handleBooking', { bookingId: id, action, adminReply: reply }),
  getSchedule: () => call('getSchedule'),
  sendNotify: (data) => call('sendNotify', data),
  cancelBooking: (id) => call('cancelBooking', { bookingId: id }),
  setupVerify: (password) => call('setupVerify', { password }),
  setupGetAllStudents: (data) => call('setupGetAllStudents', data),
  setupGetAdmins: () => call('setupGetAdmins'),
  setupSetAdmin: (openid) => call('setupSetAdmin', { openid }),
  setupUpdateSchool: (data) => call('setupUpdateSchool', data)
}
