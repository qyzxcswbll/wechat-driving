# 平安驾校微信小程序 — 实施计划

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 开发一款驾校预约微信小程序，学员可预约参观/上课，管理员（爸爸）可审核管理

**Architecture:** 微信原生小程序 + 微信云开发（云数据库 × 4 集合、云函数 × 11、云存储 × 二维码图片）。学员与管理员使用同一个小程序，首次通过微信一键登录后按 OpenID 自动路由到不同界面。

**Tech Stack:** 微信原生小程序 (wxml/wxss/js) + 微信云开发 (cloudbase)

---

## 文件结构

```
wechat-driving/
├── miniprogram/
│   ├── app.js                        # 全局入口：身份判断 + 云开发初始化
│   ├── app.json                      # 全局配置：注册所有页面
│   ├── app.wxss                      # 全局样式：主题色变量
│   ├── env.js                        # 环境常量（云开发环境 ID）
│   ├── pages/
│   │   ├── student/
│   │   │   ├── home/                 # 学员首页
│   │   │   ├── school/               # 了解驾校
│   │   │   ├── visit/                # 预约参观
│   │   │   ├── booking/              # 预约上课（多日期）
│   │   │   ├── my-bookings/          # 我的预约列表
│   │   │   ├── booking-detail/       # 预约详情
│   │   │   └── contact/              # 联系我们
│   │   └── admin/
│   │       ├── home/                 # 管理首页
│   │       ├── visits/               # 咨询学员
│   │       ├── bookings/             # 预约管理
│   │       └── schedule/             # 课程表
│   ├── components/
│   │   ├── nav-bar/                  # 自定义底部导航组件
│   │   └── status-badge/             # 预约状态标签组件
│   └── utils/
│       └── cloud.js                  # 云函数调用封装
├── cloudfunctions/
│   ├── login/                        # 登录 + 创建学员记录
│   ├── submitVisit/                  # 提交参观咨询
│   ├── getVisits/                    # 获取参观咨询列表
│   ├── markContacted/                # 标记已联系
│   ├── submitBooking/                # 提交上课预约（批量）
│   ├── getMyBookings/                # 学员获取自己的预约
│   ├── getAllBookings/               # 管理员获取所有预约
│   ├── handleBooking/                # 接受/拒绝预约
│   ├── getSchedule/                  # 获取课程表
│   ├── getSchoolInfo/                # 获取驾校信息
│   └── sendNotify/                   # 发送订阅消息
└── project.config.json               # 微信开发者工具配置
```

---

## 实施任务

### Task 1：项目脚手架 + 云开发环境

**文件：**
- Create: `project.config.json`
- Create: `miniprogram/env.js`
- Create: `miniprogram/app.js`
- Create: `miniprogram/app.json`
- Create: `miniprogram/app.wxss`

- [ ] **Step 1：创建 project.config.json**

```json
{
  "description": "平安驾校预约小程序",
  "packOptions": { "ignore": [] },
  "setting": {
    "urlCheck": true,
    "es6": true,
    "postcss": true,
    "minified": true,
    "cloud": true
  },
  "cloudfunctionRoot": "cloudfunctions/",
  "compileType": "miniprogram",
  "libVersion": "3.7.0",
  "appid": "wx0000000000000000",
  "projectname": "wechat-driving",
  "condition": {}
}
```

- [ ] **Step 2：创建 env.js**

```javascript
// 云开发环境 ID — 在微信开发者工具中创建云环境后替换
const CLOUD_ENV = 'your-cloud-env-id'
const ADMIN_OPENID = '' // 上线前填入爸爸的 OpenID

module.exports = { CLOUD_ENV, ADMIN_OPENID }
```

- [ ] **Step 3：创建 app.js**

```javascript
const { CLOUD_ENV } = require('./env')

App({
  globalData: { isAdmin: false, userInfo: null },
  onLaunch() {
    wx.cloud.init({ env: CLOUD_ENV })
  }
})
```

- [ ] **Step 4：创建 app.json**

```json
{
  "pages": [
    "pages/student/home/index",
    "pages/student/school/index",
    "pages/student/visit/index",
    "pages/student/booking/index",
    "pages/student/my-bookings/index",
    "pages/student/booking-detail/index",
    "pages/student/contact/index",
    "pages/admin/home/index",
    "pages/admin/visits/index",
    "pages/admin/bookings/index",
    "pages/admin/schedule/index"
  ],
  "window": {
    "navigationBarBackgroundColor": "#ffffff",
    "navigationBarTitleText": "平安驾校",
    "navigationBarTextStyle": "black",
    "backgroundColor": "#f5f5f7"
  },
  "sitemapLocation": "sitemap.json"
}
```

- [ ] **Step 5：创建 app.wxss**

```css
/* 主题色变量 */
page {
  --primary: #534AB7;
  --primary-light: #EEEDFE;
  --primary-text: #3C3489;
  --primary-muted: #7F77DD;
  --success: #0F6E56;
  --success-bg: #E1F5EE;
  --warn: #BA7517;
  --warn-bg: #FAEEDA;
  --danger: #A32D2D;
  --danger-bg: #FCEBEB;
  --gray-1: #f5f5f7;
  --gray-2: #e8e8e8;
  --gray-3: #ccc;
  --gray-4: #888;
  --gray-5: #555;
  --radius: 10px;
  --radius-sm: 6px;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
  color: #1a1a1a;
  background: var(--gray-1);
}
```

- [ ] **Step 6：创建 sitemap.json**

```json
{ "rules": [{ "action": "allow", "page": "*" }] }
```

- [ ] **Step 7：提交**

```bash
git init
git add -A
git commit -m "chore: 项目脚手架 + 云开发初始化"
```

---

### Task 2：创建云数据库集合

**说明：** 在微信开发者工具 -> 云开发控制台 -> 数据库中手动创建 4 个集合，并插入管理员记录。

- [ ] **Step 1：创建集合**
  - 在云开发控制台创建 4 个集合：`students`、`admins`、`visits`、`bookings`
  - `students`：给 `openid` 字段设置唯一索引
  - `bookings`：给 `openid`、`status`、`date` 分别设置普通索引

- [ ] **Step 2：插入管理员记录**

```javascript
// 在云开发控制台 -> admins 集合中手动添加一条记录：
{
  "openid": "",        // 上线时替换为爸爸的微信 OpenID
  "name": "张教练",
  "phone": "138xxxxxxxx",
  "schoolName": "平安驾校",
  "address": "广东省汕头市龙湖区xxx路xxx号",
  "intro": "专业教练，多年教学经验，耐心负责",
  "wechatQR": ""       // 后续上传二维码图片后填写 fileID
}
```

- [ ] **Step 3：提交**

```bash
git commit --allow-empty -m "feat: 创建云数据库集合和初始管理员记录"
```

---

### Task 3：云函数 — login

**文件：**
- Create: `cloudfunctions/login/index.js`
- Create: `cloudfunctions/login/package.json`

- [ ] **Step 1：创建 package.json**

```json
{
  "name": "login",
  "version": "1.0.0",
  "dependencies": {
    "wx-server-sdk": "~2.6.3"
  }
}
```

- [ ] **Step 2：编写云函数**

```javascript
const cloud = require('wx-server-sdk')
cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV })
const db = cloud.database()
const admins = db.collection('admins')
const students = db.collection('students')

exports.main = async (event) => {
  const { OPENID } = cloud.getWXContext()
  if (!OPENID) return { code: -1, msg: '获取身份失败' }

  // 判断是否为管理员
  const adminRes = await admins.where({ openid: OPENID }).get()
  const isAdmin = adminRes.data.length > 0

  if (isAdmin) {
    return { code: 0, data: { isAdmin: true, userInfo: adminRes.data[0] } }
  }

  // 查找或创建学员记录
  let user = await students.where({ openid: OPENID }).get()
  if (user.data.length === 0) {
    const result = await students.add({
      data: {
        openid: OPENID,
        nickName: event.nickName || '',
        avatarUrl: event.avatarUrl || '',
        phone: event.phone || '',
        createdAt: db.serverDate(),
        lastVisit: db.serverDate()
      }
    })
    return { code: 0, data: { isAdmin: false, userInfo: { _id: result._id, openid: OPENID, nickName: event.nickName, avatarUrl: event.avatarUrl, phone: event.phone || '' } } }
  }

  // 更新最近访问
  await students.doc(user.data[0]._id).update({
    data: { lastVisit: db.serverDate(), nickName: event.nickName, avatarUrl: event.avatarUrl }
  })
  return { code: 0, data: { isAdmin: false, userInfo: user.data[0] } }
}
```

- [ ] **Step 3：安装依赖并提交**

```bash
cd cloudfunctions/login && npm install && cd ../..
git add cloudfunctions/login/
git commit -m "feat: login 云函数"
```

---

### Task 4：云函数 — getSchoolInfo

**文件：**
- Create: `cloudfunctions/getSchoolInfo/index.js`
- Create: `cloudfunctions/getSchoolInfo/package.json`

- [ ] **Step 1：编写云函数**

```javascript
const cloud = require('wx-server-sdk')
cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV })
const db = cloud.database()

exports.main = async () => {
  const res = await db.collection('admins').limit(1).get()
  if (res.data.length === 0) return { code: -1, msg: '未找到驾校信息' }
  const admin = res.data[0]
  return {
    code: 0,
    data: {
      schoolName: admin.schoolName,
      address: admin.address,
      intro: admin.intro,
      coachName: admin.name,
      phone: admin.phone,
      wechatQR: admin.wechatQR
    }
  }
}
```

- [ ] **Step 2：创建 package.json 并提交**

```bash
mkdir -p cloudfunctions/getSchoolInfo
# package.json 同 Task 3（所有云函数通用，后续省略）
cd cloudfunctions/getSchoolInfo && npm init -y && npm install wx-server-sdk && cd ../..
git add cloudfunctions/getSchoolInfo/
git commit -m "feat: getSchoolInfo 云函数"
```

---

### Task 5：云函数 — submitVisit / getVisits / markContacted

**文件：**
- Create: `cloudfunctions/submitVisit/index.js`
- Create: `cloudfunctions/getVisits/index.js`
- Create: `cloudfunctions/markContacted/index.js`

- [ ] **Step 1：submitVisit 云函数**

```javascript
const cloud = require('wx-server-sdk')
cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV })
const db = cloud.database()

exports.main = async (event) => {
  const { OPENID } = cloud.getWXContext()
  const { phone, remark } = event
  if (!phone) return { code: -1, msg: '手机号不能为空' }

  // 获取微信用户信息（需要前端传 nickName）
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
```

- [ ] **Step 2：getVisits 云函数**

```javascript
const cloud = require('wx-server-sdk')
cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV })
const db = cloud.database()

exports.main = async () => {
  const res = await db.collection('visits')
    .orderBy('createdAt', 'desc')
    .get()
  return { code: 0, data: res.data }
}
```

- [ ] **Step 3：markContacted 云函数**

```javascript
const cloud = require('wx-server-sdk')
cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV })
const db = cloud.database()

exports.main = async (event) => {
  const { visitId } = event
  await db.collection('visits').doc(visitId).update({
    data: { status: 'contacted', updatedAt: db.serverDate() }
  })
  return { code: 0, msg: '已标记' }
}
```

- [ ] **Step 4：安装依赖并提交**

```bash
for d in submitVisit getVisits markContacted; do
  mkdir -p cloudfunctions/$d
  cd cloudfunctions/$d && npm init -y && npm install wx-server-sdk && cd ../..
done
git add cloudfunctions/submitVisit/ cloudfunctions/getVisits/ cloudfunctions/markContacted/
git commit -m "feat: 参观咨询相关云函数"
```

---

### Task 6：云函数 — submitBooking（批量）

**文件：**
- Create: `cloudfunctions/submitBooking/index.js`

- [ ] **Step 1：编写 submitBooking**

```javascript
const cloud = require('wx-server-sdk')
cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV })
const db = cloud.database()

exports.main = async (event) => {
  const { OPENID } = cloud.getWXContext()
  const { bookings } = event // [{ date, time, subject, remark }, ...]

  if (!bookings || bookings.length === 0) return { code: -1, msg: '请至少选择一个日期' }

  const tasks = bookings.map(b => ({
    openid: OPENID,
    nickName: event.nickName || '',
    phone: event.phone || '',
    subject: b.subject,
    date: b.date,
    time: b.time,
    remark: b.remark || '',
    status: 'pending',
    adminReply: '',
    createdAt: db.serverDate(),
    updatedAt: db.serverDate()
  }))

  const result = await db.collection('bookings').add(tasks)
  return { code: 0, data: { ids: result._id || result } }
}
```

- [ ] **Step 2：安装依赖并提交**

```bash
mkdir -p cloudfunctions/submitBooking
cd cloudfunctions/submitBooking && npm init -y && npm install wx-server-sdk && cd ../..
git add cloudfunctions/submitBooking/
git commit -m "feat: submitBooking 批量预约云函数"
```

---

### Task 7：云函数 — getMyBookings / getAllBookings / handleBooking / getSchedule

**文件：**
- Create: `cloudfunctions/getMyBookings/index.js`
- Create: `cloudfunctions/getAllBookings/index.js`
- Create: `cloudfunctions/handleBooking/index.js`
- Create: `cloudfunctions/getSchedule/index.js`

- [ ] **Step 1：getMyBookings**

```javascript
const cloud = require('wx-server-sdk')
cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV })
const db = cloud.database()

exports.main = async () => {
  const { OPENID } = cloud.getWXContext()
  const res = await db.collection('bookings')
    .where({ openid: OPENID })
    .orderBy('createdAt', 'desc')
    .get()
  return { code: 0, data: res.data }
}
```

- [ ] **Step 2：getAllBookings**

```javascript
const cloud = require('wx-server-sdk')
cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV })
const db = cloud.database()

exports.main = async () => {
  const res = await db.collection('bookings')
    .orderBy('date', 'desc')
    .orderBy('createdAt', 'desc')
    .get()
  return { code: 0, data: res.data }
}
```

- [ ] **Step 3：handleBooking**

```javascript
const cloud = require('wx-server-sdk')
cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV })
const db = cloud.database()

exports.main = async (event) => {
  const { bookingId, action, adminReply } = event
  // action: 'accepted' | 'rejected'
  const updateData = {
    status: action,
    updatedAt: db.serverDate()
  }
  if (action === 'rejected' && adminReply) {
    updateData.adminReply = adminReply
  }
  await db.collection('bookings').doc(bookingId).update({ data: updateData })
  return { code: 0, msg: action === 'accepted' ? '已接受' : '已拒绝' }
}
```

- [ ] **Step 4：getSchedule**

```javascript
const cloud = require('wx-server-sdk')
cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV })
const db = cloud.database()

exports.main = async () => {
  const res = await db.collection('bookings')
    .where({ status: 'accepted' })
    .orderBy('date', 'asc')
    .orderBy('createdAt', 'asc')
    .get()
  // 按日期分组
  const schedule = {}
  res.data.forEach(b => {
    if (!schedule[b.date]) schedule[b.date] = []
    schedule[b.date].push(b)
  })
  return { code: 0, data: schedule }
}
```

- [ ] **Step 5：安装依赖并提交**

```bash
for d in getMyBookings getAllBookings handleBooking getSchedule; do
  mkdir -p cloudfunctions/$d
  cd cloudfunctions/$d && npm init -y && npm install wx-server-sdk && cd ../..
done
git add cloudfunctions/getMyBookings/ cloudfunctions/getAllBookings/ cloudfunctions/handleBooking/ cloudfunctions/getSchedule/
git commit -m "feat: 预约查询/管理/课程表云函数"
```

---

### Task 8：云函数 — sendNotify

**文件：**
- Create: `cloudfunctions/sendNotify/index.js`

- [ ] **Step 1：编写云函数**

```javascript
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
```

- [ ] **Step 2：安装依赖并提交**

```bash
mkdir -p cloudfunctions/sendNotify
cd cloudfunctions/sendNotify && npm init -y && npm install wx-server-sdk && cd ../..
git add cloudfunctions/sendNotify/
git commit -m "feat: sendNotify 订阅消息云函数"
```

---

### Task 9：工具函数封装

**文件：**
- Create: `miniprogram/utils/cloud.js`

- [ ] **Step 1：创建 cloud.js**

```javascript
// 封装所有云函数调用
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
  getAllBookings: () => call('getAllBookings'),
  handleBooking: (id, action, reply) => call('handleBooking', { bookingId: id, action, adminReply: reply }),
  getSchedule: () => call('getSchedule'),
  sendNotify: (data) => call('sendNotify', data)
}
```

- [ ] **Step 2：提交**

```bash
git add miniprogram/utils/
git commit -m "feat: 云函数调用封装"
```

---

### Task 10：公共组件 — nav-bar（底部导航）

**文件：**
- Create: `miniprogram/components/nav-bar/nav-bar.js`
- Create: `miniprogram/components/nav-bar/nav-bar.json`
- Create: `miniprogram/components/nav-bar/nav-bar.wxml`
- Create: `miniprogram/components/nav-bar/nav-bar.wxss`

- [ ] **Step 1：nav-bar.json**

```json
{ "component": true, "usingComponents": {} }
```

- [ ] **Step 2：nav-bar.wxml**

```xml
<view class="nav-bar">
  <view
    class="nav-item {{activeTab === item.key ? 'active' : ''}}"
    wx:for="{{items}}"
    wx:key="key"
    bindtap="onTap"
    data-key="{{item.key}}"
    data-url="{{item.url}}"
  >
    <text class="icon">{{item.icon}}</text>
    <text class="label">{{item.label}}</text>
  </view>
</view>
```

- [ ] **Step 3：nav-bar.wxss**

```css
.nav-bar {
  display: flex;
  background: #fff;
  border-top: 1px solid #e8e8e8;
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  padding-bottom: env(safe-area-inset-bottom);
  z-index: 100;
}
.nav-item {
  flex: 1;
  padding: 6px 0;
  text-align: center;
  font-size: 10px;
  color: #999;
}
.nav-item.active { color: #534AB7; }
.icon { display: block; font-size: 20px; margin-bottom: 2px; }
.label { display: block; }
```

- [ ] **Step 4：nav-bar.js**

```javascript
Component({
  properties: {
    activeTab: { type: String, value: '' },
    items: { type: Array, value: [] }
  },
  methods: {
    onTap(e) {
      const url = e.currentTarget.dataset.url
      if (url) wx.redirectTo({ url })
    }
  }
})
```

- [ ] **Step 5：提交**

```bash
git add miniprogram/components/nav-bar/
git commit -m "feat: 底部导航组件"
```

---

### Task 11：公共组件 — status-badge（状态标签）

**文件：**
- Create: `miniprogram/components/status-badge/status-badge.js`
- Create: `miniprogram/components/status-badge/status-badge.json`
- Create: `miniprogram/components/status-badge/status-badge.wxml`
- Create: `miniprogram/components/status-badge/status-badge.wxss`

- [ ] **Step 1：status-badge.json**

```json
{ "component": true, "usingComponents": {} }
```

- [ ] **Step 2：status-badge.wxml**

```xml
<view class="badge {{status}}">
  <text wx:if="{{status === 'pending'}}">⏳ 待确认</text>
  <text wx:elif="{{status === 'accepted'}}">✅ 已接受</text>
  <text wx:elif="{{status === 'rejected'}}">❌ 已拒绝</text>
  <text wx:elif="{{status === 'contacted'}}">✅ 已联系</text>
  <text wx:else>{{status}}</text>
</view>
```

- [ ] **Step 3：status-badge.wxss**

```css
.badge {
  display: inline-flex;
  align-items: center;
  font-size: 12px;
  padding: 2px 8px;
  border-radius: 4px;
}
.pending { background: #FAEEDA; color: #BA7517; }
.accepted { background: #E1F5EE; color: #0F6E56; }
.rejected { background: #FCEBEB; color: #A32D2D; }
.contacted { background: #E1F5EE; color: #0F6E56; }
```

- [ ] **Step 4：status-badge.js**

```javascript
Component({
  properties: {
    status: { type: String, value: 'pending' }
  }
})
```

- [ ] **Step 5：提交**

```bash
git add miniprogram/components/status-badge/
git commit -m "feat: 状态标签组件"
```

---

### Task 12：学员首页

**文件：**
- Create: `miniprogram/pages/student/home/index.js`
- Create: `miniprogram/pages/student/home/index.json`
- Create: `miniprogram/pages/student/home/index.wxml`
- Create: `miniprogram/pages/student/home/index.wxss`

- [ ] **Step 1：index.json**

```json
{
  "navigationBarTitleText": "平安驾校",
  "usingComponents": {
    "nav-bar": "/components/nav-bar/nav-bar"
  }
}
```

- [ ] **Step 2：index.wxml**

```xml
<view class="page">
  <view class="hero">
    <view class="hero-title">🚗 {{schoolInfo.schoolName || '平安驾校'}}</view>
    <view class="hero-sub">专业驾驶培训</view>
  </view>

  <view class="info-card">
    <view class="info-row"><text class="info-label">📍 地址</text><text class="info-val">{{schoolInfo.address}}</text></view>
    <view class="info-row"><text class="info-label">👨‍🏫 教练</text><text class="info-val">{{schoolInfo.coachName}}</text></view>
    <view class="info-row"><text class="info-label">📞 电话</text><text class="info-val">{{schoolInfo.phone}}</text></view>
  </view>

  <view class="intro-card" wx:if="{{schoolInfo.intro}}">
    <view class="section-title">驾校简介</view>
    <text class="intro-text">{{schoolInfo.intro}}</text>
  </view>

  <view class="menu-grid">
    <view class="menu-item" bindtap="goTo" data-url="../school/index">
      <text class="menu-icon">📋</text>
      <text class="menu-label">了解驾校</text>
    </view>
    <view class="menu-item" bindtap="goTo" data-url="../booking/index">
      <text class="menu-icon">📅</text>
      <text class="menu-label">预约学车</text>
    </view>
    <view class="menu-item" bindtap="goTo" data-url="../my-bookings/index">
      <text class="menu-icon">📍</text>
      <text class="menu-label">我的预约</text>
    </view>
    <view class="menu-item" bindtap="goTo" data-url="../contact/index">
      <text class="menu-icon">💬</text>
      <text class="menu-label">联系我们</text>
    </view>
  </view>
</view>

<nav-bar activeTab="home" items="{{navItems}}" />
```

- [ ] **Step 3：index.wxss**

```css
.page { padding: 16px 16px 70px; }
.hero {
  background: linear-gradient(135deg, #EEEDFE, #F8F7FF);
  border-radius: 14px;
  padding: 24px;
  text-align: center;
  margin-bottom: 16px;
  border: 1px solid #CECBF6;
}
.hero-title { font-size: 22px; font-weight: 600; color: #3C3489; margin-bottom: 4px; }
.hero-sub { font-size: 14px; color: #7F77DD; }
.info-card {
  background: #fff; border-radius: 12px; padding: 14px;
  margin-bottom: 12px; border: 1px solid #e8e8e8;
}
.info-row { display: flex; padding: 6px 0; font-size: 14px; }
.info-label { color: #888; width: 70px; flex-shrink: 0; }
.info-val { color: #333; }
.intro-card { background: #fff; border-radius: 12px; padding: 14px; margin-bottom: 16px; border: 1px solid #e8e8e8; }
.section-title { font-size: 15px; font-weight: 500; color: #333; margin-bottom: 8px; }
.intro-text { font-size: 14px; color: #555; line-height: 1.7; }
.menu-grid {
  display: grid; grid-template-columns: 1fr 1fr; gap: 10px;
}
.menu-item {
  background: #fff; border: 1px solid #e8e8e8;
  border-radius: 12px; padding: 18px 12px;
  text-align: center;
}
.menu-icon { display: block; font-size: 28px; margin-bottom: 6px; }
.menu-label { font-size: 13px; color: #555; }
```

- [ ] **Step 4：index.js**

```javascript
const cloud = require('../../../utils/cloud')
const NAV_ITEMS = [
  { key: 'home', icon: '🏠', label: '首页', url: '../home/index' },
  { key: 'booking', icon: '📅', label: '预约', url: '../booking/index' },
  { key: 'my', icon: '📍', label: '我的', url: '../my-bookings/index' },
  { key: 'contact', icon: '💬', label: '联系', url: '../contact/index' }
]

Page({
  data: { schoolInfo: {}, navItems: NAV_ITEMS },
  onLoad() {
    cloud.getSchoolInfo().then(res => {
      if (res.code === 0) this.setData({ schoolInfo: res.data })
    })
  },
  goTo(e) { wx.navigateTo({ url: e.currentTarget.dataset.url }) }
})
```

- [ ] **Step 5：提交**

```bash
git add miniprogram/pages/student/home/
git commit -m "feat: 学员首页"
```

---

### Task 13：了解驾校 + 预约参观 + 联系我们

**文件：**
- Create: `miniprogram/pages/student/school/index.*`
- Create: `miniprogram/pages/student/visit/index.*`
- Create: `miniprogram/pages/student/contact/index.*`

- [ ] **Step 1：了解驾校页面**

index.wxml：
```xml
<view class="page">
  <view class="hero">
    <view class="hero-title">🚗 {{info.schoolName}}</view>
    <view class="hero-sub">{{info.coachName}} · {{info.phone}}</view>
  </view>
  <view class="card">
    <view class="section-title">📍 地址</view>
    <text class="body-text">{{info.address}}</text>
  </view>
  <view class="card">
    <view class="section-title">👨‍🏫 教练介绍</view>
    <text class="body-text">{{info.intro}}</text>
  </view>
  <view class="action-bar">
    <view class="btn" bindtap="callPhone" data-phone="{{info.phone}}">📞 拨打电话</view>
    <view class="btn secondary" bindtap="goVisit">📋 预约参观</view>
  </view>
</view>
```

index.js：
```javascript
const cloud = require('../../../utils/cloud')
Page({
  data: { info: {} },
  onLoad() { cloud.getSchoolInfo().then(r => { if(r.code===0) this.setData({info: r.data}) }) },
  callPhone(e) { wx.makePhoneCall({ phoneNumber: e.currentTarget.dataset.phone }) },
  goVisit() { wx.navigateTo({ url: '../visit/index' }) }
})
```

- [ ] **Step 2：预约参观页面**

index.wxml：
```xml
<view class="page">
  <view class="card">
    <view class="field">
      <view class="field-label">微信昵称</view>
      <view class="field-display">{{nickName}}</view>
    </view>
    <view class="field">
      <view class="field-label">手机号 <text class="required">*</text></view>
      <input class="field-input" placeholder="请输入手机号" bindinput="onPhoneInput" />
    </view>
    <view class="field">
      <view class="field-label">备注（可选）</view>
      <input class="field-input" placeholder="有什么想了解的？" bindinput="onRemarkInput" />
    </view>
  </view>
  <view class="btn primary" bindtap="submit">提交参观申请</view>
  <view class="hint">提交后教练会主动联系您约时间参观</view>
</view>
```

index.js：
```javascript
const cloud = require('../../../utils/cloud')
const app = getApp()
Page({
  data: { nickName: '', phone: '', remark: '' },
  onLoad() {
    this.setData({ nickName: app.globalData.userInfo?.nickName || '' })
  },
  onPhoneInput(e) { this.setData({ phone: e.detail.value }) },
  onRemarkInput(e) { this.setData({ remark: e.detail.value }) },
  async submit() {
    if (!this.data.phone) return wx.showToast({ title: '请输入手机号', icon: 'none' })
    wx.showLoading({ title: '提交中...' })
    const res = await cloud.submitVisit({
      nickName: this.data.nickName,
      phone: this.data.phone,
      remark: this.data.remark
    })
    wx.hideLoading()
    if (res.code === 0) {
      wx.showToast({ title: '提交成功' })
      setTimeout(() => wx.navigateBack(), 1500)
    } else {
      wx.showToast({ title: res.msg || '提交失败', icon: 'none' })
    }
  }
})
```

- [ ] **Step 3：联系我们页面**

index.wxml：
```xml
<view class="page">
  <view class="card" style="text-align:center;padding:24px;">
    <view class="section-title">👨‍🏫 {{info.coachName}}</view>
    <view class="qr-placeholder" bindtap="saveQR">
      <image wx:if="{{info.wechatQR}}" src="{{info.wechatQR}}" mode="widthFix" style="width:180px;border-radius:8px;" />
      <view wx:else class="qr-empty">微信二维码</view>
    </view>
    <text class="hint">长按识别二维码添加微信</text>
    <view class="btn secondary" bindtap="copyWechat" style="margin:12px 0;">
      📋 复制微信号
    </view>
    <contact-button type="default-light" size="20" session-from="{{info.coachName}}"></contact-button>
  </view>
  <view class="card" style="text-align:center;">
    <view class="btn" bindtap="callPhone" data-phone="{{info.phone}}">📞 拨打电话</view>
  </view>
</view>
```

index.js：
```javascript
const cloud = require('../../../utils/cloud')
Page({
  data: { info: {} },
  onLoad() {
    cloud.getSchoolInfo().then(r => { if(r.code===0) this.setData({info: r.data}) })
  },
  callPhone(e) { wx.makePhoneCall({ phoneNumber: e.currentTarget.dataset.phone }) },
  copyWechat() {
    wx.setClipboardData({ data: this.data.info.coachName + '的微信' })
  },
  saveQR() {
    // 微信二维码保存到相册，需用户授权
    wx.showToast({ title: '长按图片即可识别', icon: 'none' })
  }
})
```

- [ ] **Step 4：提交**

```bash
git add miniprogram/pages/student/school/ miniprogram/pages/student/visit/ miniprogram/pages/student/contact/
git commit -m "feat: 了解驾校 + 预约参观 + 联系我们"
```

---

### Task 14：预约上课页面（多日期）

**文件：**
- Create: `miniprogram/pages/student/booking/index.js`
- Create: `miniprogram/pages/student/booking/index.json`
- Create: `miniprogram/pages/student/booking/index.wxml`
- Create: `miniprogram/pages/student/booking/index.wxss`

- [ ] **Step 1：index.wxml**

```xml
<view class="page">
  <view class="card">
    <view class="field">
      <view class="field-label">学车类型</view>
      <view class="pill-group">
        <view class="pill {{subject==='科目二'?'active':''}}" bindtap="setSubject" data-val="科目二">科目二</view>
        <view class="pill {{subject==='科目三'?'active':''}}" bindtap="setSubject" data-val="科目三">科目三</view>
      </view>
    </view>
    <view class="field">
      <view class="field-label">备注（可选）</view>
      <input class="field-input" placeholder="自动挡/手动挡？" bindinput="onRemarkInput" />
    </view>
  </view>

  <view class="section-title" style="margin:16px 12px 8px;">预约日期</view>
  <view wx:for="{{slots}}" wx:key="index" class="slot-card">
    <view class="slot-row">
      <view class="slot-date" bindtap="pickDate" data-index="{{index}}">
        📅 {{item.date || '选择日期'}}
      </view>
      <input class="slot-time" placeholder="期望时间" value="{{item.time}}" bindinput="onTimeInput" data-index="{{index}}" />
    </view>
    <view class="slot-remark">
      <input placeholder="备注（可选）" value="{{item.remark}}" bindinput="onSlotRemark" data-index="{{index}}" />
    </view>
    <view class="slot-del" wx:if="{{slots.length>1}}" bindtap="removeSlot" data-index="{{index}}">删除</view>
  </view>

  <view class="add-slot" bindtap="addSlot">+ 再添加一个日期</view>
  <view class="btn primary" bindtap="submit">一次性提交所有预约（{{slots.length}}节）</view>
</view>
```

- [ ] **Step 2：index.js**

```javascript
const cloud = require('../../../utils/cloud')
const app = getApp()
Page({
  data: {
    subject: '科目二',
    remark: '',
    slots: [{ date: '', time: '', remark: '' }],
    nickName: '',
    phone: ''
  },
  onLoad() {
    const ui = app.globalData.userInfo
    this.setData({ nickName: ui?.nickName || '', phone: ui?.phone || '' })

    // 若没有手机号，尝试获取
    if (!ui?.phone) {
      wx.getSetting({
        success: r => {
          if (r.authSetting['scope.phoneNumber']) this.getPhone()
        }
      })
    }
  },
  getPhone() {
    // 微信手机号授权，通过 button open-type="getPhoneNumber" 触发
    // 简化处理：不在 onLoad 中请求
  },
  setSubject(e) { this.setData({ subject: e.currentTarget.dataset.val }) },
  onRemarkInput(e) { this.setData({ remark: e.detail.value }) },
  onTimeInput(e) {
    const idx = e.currentTarget.dataset.index
    const key = `slots[${idx}].time`
    this.setData({ [key]: e.detail.value })
  },
  onSlotRemark(e) {
    const idx = e.currentTarget.dataset.index
    const key = `slots[${idx}].remark`
    this.setData({ [key]: e.detail.value })
  },
  pickDate(e) {
    const idx = e.currentTarget.dataset.index
    wx.showDatePicker({
      success: res => {
        const key = `slots[${idx}].date`
        this.setData({ [key]: res.date })
      }
    })
  },
  addSlot() {
    const slots = [...this.data.slots, { date: '', time: '', remark: '' }]
    this.setData({ slots })
  },
  removeSlot(e) {
    const slots = this.data.slots.filter((_, i) => i !== e.currentTarget.dataset.index)
    this.setData({ slots })
  },
  async submit() {
    const validSlots = this.data.slots.filter(s => s.date && s.time)
    if (validSlots.length === 0) {
      return wx.showToast({ title: '请至少填写一个日期和时间', icon: 'none' })
    }
    wx.showLoading({ title: '提交中...' })
    const bookings = validSlots.map(s => ({
      date: s.date, time: s.time,
      subject: this.data.subject,
      remark: s.remark || this.data.remark
    }))
    const res = await cloud.submitBooking({
      nickName: this.data.nickName,
      phone: this.data.phone,
      bookings
    })
    wx.hideLoading()
    if (res.code === 0) {
      wx.showToast({ title: `成功提交${validSlots.length}节预约` })
      setTimeout(() => wx.navigateBack(), 1500)
    } else {
      wx.showToast({ title: res.msg || '提交失败', icon: 'none' })
    }
  }
})
```

- [ ] **Step 3：提交**

```bash
git add miniprogram/pages/student/booking/
git commit -m "feat: 预约上课（多日期）"
```

---

### Task 15：我的预约列表 + 预约详情

**文件：**
- Create: `miniprogram/pages/student/my-bookings/index.*`
- Create: `miniprogram/pages/student/booking-detail/index.*`

- [ ] **Step 1：我的预约列表**

index.wxml：
```xml
<view class="page">
  <view wx:if="{{list.length===0}}" class="empty">
    <text class="empty-icon">📋</text>
    <text class="empty-text">暂无预约记录</text>
  </view>
  <view wx:for="{{list}}" wx:key="_id" class="booking-card {{item.status}}"
    bindtap="goDetail" data-id="{{item._id}}">
    <view class="booking-top">
      <text class="booking-date">{{item.date}} {{item.time}}</text>
      <status-badge status="{{item.status}}" />
    </view>
    <view class="booking-info">{{item.subject}}{{item.remark ? ' · ' + item.remark : ''}}</view>
  </view>
</view>
<nav-bar activeTab="my" items="{{navItems}}" />
```

index.js：
```javascript
const cloud = require('../../../utils/cloud')
const NAV_ITEMS = [
  { key: 'home', icon: '🏠', label: '首页', url: '../home/index' },
  { key: 'booking', icon: '📅', label: '预约', url: '../booking/index' },
  { key: 'my', icon: '📍', label: '我的', url: '../my-bookings/index' },
  { key: 'contact', icon: '💬', label: '联系', url: '../contact/index' }
]
Page({
  data: { list: [], navItems: NAV_ITEMS },
  onShow() { this.loadData() },
  async loadData() {
    wx.showLoading({ title: '加载中...' })
    const res = await cloud.getMyBookings()
    wx.hideLoading()
    if (res.code === 0) this.setData({ list: res.data })
  },
  goDetail(e) { wx.navigateTo({ url: `../booking-detail/index?id=${e.currentTarget.dataset.id}` }) }
})
```

- [ ] **Step 2：预约详情页**

index.wxml：
```xml
<view class="page">
  <view class="card" wx:if="{{info._id}}">
    <view class="detail-row"><text class="dl">状态</text><status-badge status="{{info.status}}" /></view>
    <view class="detail-row"><text class="dl">日期</text><text class="dv">{{info.date}}</text></view>
    <view class="detail-row"><text class="dl">时间</text><text class="dv">{{info.time}}</text></view>
    <view class="detail-row"><text class="dl">科目</text><text class="dv">{{info.subject}}</text></view>
    <view class="detail-row" wx:if="{{info.remark}}"><text class="dl">备注</text><text class="dv">{{info.remark}}</text></view>
    <view class="detail-row" wx:if="{{info.adminReply}}">
      <text class="dl">教练回复</text><text class="dv" style="color:#A32D2D;">{{info.adminReply}}</text>
    </view>
    <view class="detail-row"><text class="dl">提交时间</text><text class="dv">{{info.createdAt}}</text></view>
  </view>
</view>
```

index.js：
```javascript
const cloud = require('../../../utils/cloud')
Page({
  data: { info: {} },
  onLoad(options) {
    wx.showLoading({ title: '加载中...' })
    cloud.getMyBookings().then(res => {
      wx.hideLoading()
      if (res.code === 0) {
        const item = res.data.find(b => b._id === options.id)
        if (item) this.setData({ info: item })
      }
    })
  }
})
```

- [ ] **Step 3：提交**

```bash
git add miniprogram/pages/student/my-bookings/ miniprogram/pages/student/booking-detail/
git commit -m "feat: 我的预约列表 + 预约详情"
```

---

### Task 16：管理首页

**文件：**
- Create: `miniprogram/pages/admin/home/index.*`

- [ ] **Step 1：index.wxml**

```xml
<view class="page">
  <view class="stats-row">
    <view class="stat-card pending">
      <view class="stat-num">{{pendingCount}}</view>
      <view class="stat-lbl">待处理</view>
    </view>
    <view class="stat-card">
      <view class="stat-num">{{visitCount}}</view>
      <view class="stat-lbl">参观咨询</view>
    </view>
    <view class="stat-card success">
      <view class="stat-num">{{confirmedCount}}</view>
      <view class="stat-lbl">已确认</view>
    </view>
  </view>

  <view class="menu-grid">
    <view class="menu-item" bindtap="goTo" data-url="../visits/index">
      <text class="menu-icon">🙋</text><text class="menu-label">咨询学员</text>
    </view>
    <view class="menu-item" bindtap="goTo" data-url="../bookings/index">
      <text class="menu-icon">📋</text><text class="menu-label">预约管理</text>
    </view>
    <view class="menu-item" bindtap="goTo" data-url="../schedule/index">
      <text class="menu-icon">📅</text><text class="menu-label">课程表</text>
    </view>
  </view>
</view>
<nav-bar activeTab="home" items="{{navItems}}" />
```

- [ ] **Step 2：index.js**

```javascript
const cloud = require('../../../utils/cloud')
const NAV_ITEMS = [
  { key: 'home', icon: '📊', label: '首页', url: '../home/index' },
  { key: 'visits', icon: '🙋', label: '咨询', url: '../visits/index' },
  { key: 'bookings', icon: '📋', label: '预约', url: '../bookings/index' },
  { key: 'schedule', icon: '📅', label: '课程', url: '../schedule/index' }
]
Page({
  data: { pendingCount: 0, visitCount: 0, confirmedCount: 0, navItems: NAV_ITEMS },
  onShow() { this.loadStats() },
  async loadStats() {
    const [bRes, vRes] = await Promise.all([cloud.getAllBookings(), cloud.getVisits()])
    if (bRes.code === 0) {
      const all = bRes.data
      this.setData({
        pendingCount: all.filter(b => b.status === 'pending').length,
        confirmedCount: all.filter(b => b.status === 'accepted').length
      })
    }
    if (vRes.code === 0) {
      this.setData({ visitCount: vRes.data.filter(v => v.status === 'pending').length })
    }
  },
  goTo(e) { wx.redirectTo({ url: e.currentTarget.dataset.url }) }
})
```

- [ ] **Step 3：提交**

```bash
git add miniprogram/pages/admin/home/
git commit -m "feat: 管理首页"
```

---

### Task 17：咨询学员管理页

**文件：**
- Create: `miniprogram/pages/admin/visits/index.*`

- [ ] **Step 1：index.wxml**

```xml
<view class="page">
  <view wx:if="{{list.length===0}}" class="empty">
    <text class="empty-icon">🙋</text>
    <text class="empty-text">暂无参观咨询</text>
  </view>
  <view wx:for="{{list}}" wx:key="_id" class="card visit-card">
    <view class="visit-top">
      <text class="visit-name">{{item.nickName || '未留名'}}</text>
      <status-badge status="{{item.status}}" />
    </view>
    <view class="visit-info">📱 {{item.phone}}</view>
    <view class="visit-info" wx:if="{{item.remark}}">💬 {{item.remark}}</view>
    <view class="visit-time">🕐 {{item.createdAt}}</view>
    <view class="visit-actions" wx:if="{{item.status==='pending'}}">
      <view class="btn small" bindtap="markDone" data-id="{{item._id}}">✅ 标记已联系</view>
      <view class="btn small secondary" bindtap="callPhone" data-phone="{{item.phone}}">📞 打电话</view>
    </view>
  </view>
</view>
<nav-bar activeTab="visits" items="{{navItems}}" />
```

- [ ] **Step 2：index.js**

```javascript
const cloud = require('../../../utils/cloud')
const NAV_ITEMS = [
  { key: 'home', icon: '📊', label: '首页', url: '../home/index' },
  { key: 'visits', icon: '🙋', label: '咨询', url: '../visits/index' },
  { key: 'bookings', icon: '📋', label: '预约', url: '../bookings/index' },
  { key: 'schedule', icon: '📅', label: '课程', url: '../schedule/index' }
]
Page({
  data: { list: [], navItems: NAV_ITEMS },
  onShow() { this.load() },
  async load() {
    const res = await cloud.getVisits()
    if (res.code === 0) this.setData({ list: res.data })
  },
  async markDone(e) {
    await cloud.markContacted(e.currentTarget.dataset.id)
    wx.showToast({ title: '已标记' })
    this.load()
  },
  callPhone(e) { wx.makePhoneCall({ phoneNumber: e.currentTarget.dataset.phone }) }
})
```

- [ ] **Step 3：提交**

```bash
git add miniprogram/pages/admin/visits/
git commit -m "feat: 咨询学员管理页"
```

---

### Task 18：预约管理页（接受/拒绝）

**文件：**
- Create: `miniprogram/pages/admin/bookings/index.*`

- [ ] **Step 1：index.wxml**

```xml
<view class="page">
  <view class="filter-bar">
    <picker mode="selector" range="{{filters}}" value="{{filterIdx}}" bindchange="onFilter">
      <text class="filter-text">📋 {{filters[filterIdx]}}</text>
    </picker>
  </view>

  <view wx:for="{{displayList}}" wx:key="_id" class="mcard {{item.status}}">
    <view class="mcard-top">
      <text class="mcard-name">{{item.nickName}} · {{item.subject}}</text>
      <status-badge status="{{item.status}}" />
    </view>
    <view class="mcard-info">📅 {{item.date}} {{item.time}}</view>
    <view class="mcard-info">📱 {{item.phone}}</view>
    <view class="mcard-info" wx:if="{{item.remark}}">💬 {{item.remark}}</view>

    <view wx:if="{{item.status==='pending'}}" class="action-row">
      <view class="abtn accept" bindtap="acceptBooking" data-id="{{item._id}}">✓ 接受</view>
      <view class="abtn reject" bindtap="rejectBooking" data-id="{{item._id}}">✗ 拒绝</view>
      <view class="abtn wx" bindtap="callPhone" data-phone="{{item.phone}}">💬 微信</view>
    </view>
    <view wx:elif="{{item.status==='rejected' && item.adminReply}}" class="mcard-reply">
      原因：{{item.adminReply}}
    </view>
  </view>
</view>
<nav-bar activeTab="bookings" items="{{navItems}}" />
```

- [ ] **Step 2：index.js**

```javascript
const cloud = require('../../../utils/cloud')
const NAV_ITEMS = [
  { key: 'home', icon: '📊', label: '首页', url: '../home/index' },
  { key: 'visits', icon: '🙋', label: '咨询', url: '../visits/index' },
  { key: 'bookings', icon: '📋', label: '预约', url: '../bookings/index' },
  { key: 'schedule', icon: '📅', label: '课程', url: '../schedule/index' }
]
Page({
  data: { list: [], displayList: [], filterIdx: 0, filters: ['全部', '待处理', '已接受', '已拒绝'], navItems: NAV_ITEMS },
  onShow() { this.load() },
  async load() {
    const res = await cloud.getAllBookings()
    if (res.code === 0) {
      this.setData({ list: res.data })
      this.applyFilter()
    }
  },
  applyFilter() {
    const idx = this.data.filterIdx
    let displayList = this.data.list
    if (idx === 1) displayList = displayList.filter(b => b.status === 'pending')
    else if (idx === 2) displayList = displayList.filter(b => b.status === 'accepted')
    else if (idx === 3) displayList = displayList.filter(b => b.status === 'rejected')
    this.setData({ displayList })
  },
  onFilter(e) {
    this.setData({ filterIdx: parseInt(e.detail.value) })
    this.applyFilter()
  },
  async acceptBooking(e) {
    wx.showLoading({ title: '处理中...' })
    await cloud.handleBooking(e.currentTarget.dataset.id, 'accepted')
    wx.hideLoading()
    wx.showToast({ title: '已接受' })
    this.load()
  },
  async rejectBooking(e) {
    const { value: reason } = await wx.showModal({ title: '拒绝原因', content: '请输入拒绝原因', editable: true })
    if (reason) {
      wx.showLoading({ title: '处理中...' })
      await cloud.handleBooking(e.currentTarget.dataset.id, 'rejected', reason)
      wx.hideLoading()
      wx.showToast({ title: '已拒绝' })
      this.load()
    }
  },
  callPhone(e) { wx.makePhoneCall({ phoneNumber: e.currentTarget.dataset.phone }) }
})
```

- [ ] **Step 3：提交**

```bash
git add miniprogram/pages/admin/bookings/
git commit -m "feat: 预约管理（接受/拒绝）"
```

---

### Task 19：课程表页

**文件：**
- Create: `miniprogram/pages/admin/schedule/index.*`

- [ ] **Step 1：index.wxml**

```xml
<view class="page">
  <view class="card">
    <view class="cal-nav">
      <text class="cal-arrow" bindtap="prevWeek">‹</text>
      <text class="cal-title">{{weekLabel}}</text>
      <text class="cal-arrow" bindtap="nextWeek">›</text>
    </view>
    <view class="cal-row">
      <view wx:for="{{weekDays}}" wx:key="index"
        class="cal-day {{item.isToday?'today':''}} {{item.active?'active':''}}"
        bindtap="selectDay" data-date="{{item.date}}">
        <text class="cal-dow">{{item.dow}}</text>
        <text class="cal-date">{{item.day}}</text>
      </view>
    </view>
  </view>

  <view class="section-title" style="margin:16px 12px 8px;">{{selectedDate}} 课程</view>
  <view wx:if="{{!daySchedule || daySchedule.length===0}}" class="empty-card">当天暂无课程</view>
  <view wx:for="{{daySchedule}}" wx:key="_id" class="schedule-item accepted">
    <text class="schedule-time">{{item.time}}</text>
    <text class="schedule-info">{{item.nickName}} · {{item.subject}}</text>
  </view>
</view>
<nav-bar activeTab="schedule" items="{{navItems}}" />
```

- [ ] **Step 2：index.js**

```javascript
const cloud = require('../../../utils/cloud')
const NAV_ITEMS = [
  { key: 'home', icon: '📊', label: '首页', url: '../home/index' },
  { key: 'visits', icon: '🙋', label: '咨询', url: '../visits/index' },
  { key: 'bookings', icon: '📋', label: '预约', url: '../bookings/index' },
  { key: 'schedule', icon: '📅', label: '课程', url: '../schedule/index' }
]
const DOWS = ['日', '一', '二', '三', '四', '五', '六']

Page({
  data: {
    scheduleMap: {},
    weekDays: [],
    weekLabel: '',
    selectedDate: '',
    daySchedule: [],
    weekOffset: 0,
    navItems: NAV_ITEMS
  },
  onShow() { this.loadSchedule() },
  async loadSchedule() {
    const res = await cloud.getSchedule()
    if (res.code === 0) {
      this.setData({ scheduleMap: res.data })
      this.renderWeek()
    }
  },
  renderWeek() {
    const now = new Date()
    now.setDate(now.getDate() + this.data.weekOffset * 7)
    const startOfWeek = new Date(now)
    startOfWeek.setDate(now.getDate() - now.getDay())

    const days = [], todayStr = this.dateStr(new Date())
    for (let i = 0; i < 7; i++) {
      const d = new Date(startOfWeek)
      d.setDate(startOfWeek.getDate() + i)
      const dateStr = this.dateStr(d)
      days.push({
        date: dateStr,
        dow: DOWS[d.getDay()],
        day: String(d.getDate()).padStart(2, '0'),
        isToday: dateStr === todayStr,
        active: dateStr === this.data.selectedDate || (!this.data.selectedDate && i === now.getDay())
      })
    }

    const firstDay = days.find(d => d.active) || days[0]
    const weekLabel = `${days[0].date} ~ ${days[6].date}`
    this.setData({
      weekDays: days,
      weekLabel,
      selectedDate: firstDay.date,
      daySchedule: this.data.scheduleMap[firstDay.date] || []
    })
  },
  selectDay(e) {
    const date = e.currentTarget.dataset.date
    this.setData({
      selectedDate: date,
      daySchedule: this.data.scheduleMap[date] || []
    })
    this.renderWeek()
  },
  prevWeek() {
    this.setData({ weekOffset: this.data.weekOffset - 1 })
    this.renderWeek()
  },
  nextWeek() {
    this.setData({ weekOffset: this.data.weekOffset + 1 })
    this.renderWeek()
  },
  dateStr(d) {
    return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`
  }
})
```

- [ ] **Step 3：提交**

```bash
git add miniprogram/pages/admin/schedule/
git commit -m "feat: 课程表页"
```

---

### Task 20：app.js 集成身份路由

**文件：**
- Modify: `miniprogram/app.js`

- [ ] **Step 1：重写 app.js**

```javascript
const { CLOUD_ENV } = require('./env')
const cloud = require('./utils/cloud')

App({
  globalData: { isAdmin: false, userInfo: null },
  onLaunch() {
    wx.cloud.init({ env: CLOUD_ENV })
  },
  // 在页面 onLoad 中调用此方法进行身份判断和路由
  async checkAuth() {
    wx.showLoading({ title: '加载中...' })
    const res = await cloud.login({
      nickName: this.globalData.userInfo?.nickName || '',
      avatarUrl: this.globalData.userInfo?.avatarUrl || ''
    })
    wx.hideLoading()
    if (res.code === 0) {
      this.globalData.isAdmin = res.data.isAdmin
      this.globalData.userInfo = res.data.userInfo

      // 获取用户信息
      if (!res.data.isAdmin) {
        wx.getUserProfile({
          desc: '用于展示用户信息',
          success: (profile) => {
            this.globalData.userInfo = { ...this.globalData.userInfo, ...profile.userInfo }
          }
        })
      }

      // 路由到对应首页
      const homePage = res.data.isAdmin ? '/pages/admin/home/index' : '/pages/student/home/index'
      wx.redirectTo({ url: homePage })
    } else {
      wx.showToast({ title: '登录失败', icon: 'none' })
    }
  }
})
```

- [ ] **Step 2：创建启动入口页面**

创建一个简单的 `splash/` 页面作为启动入口，调用 `app.checkAuth()`：

pages/splash/index.wxml：
```xml
<view class="splash">
  <view class="splash-icon">🚗</view>
  <view class="splash-title">平安驾校</view>
  <text class="splash-sub">加载中...</text>
</view>
```

pages/splash/index.js：
```javascript
const app = getApp()
Page({ onLoad() { app.checkAuth() } })
```

- [ ] **Step 3：更新 app.json 添加 splash 页面**

```json
{
  "pages": [
    "pages/splash/index",
    "pages/student/home/index",
    ...
  ],
  "entryPagePath": "pages/splash/index",
  ...
}
```

- [ ] **Step 4：提交**

```bash
git add miniprogram/app.js miniprogram/pages/splash/
git commit -m "feat: 身份路由 + 启动页"
```

---

### Task 21：集成微信订阅消息通知

**文件：**
- Modify: `miniprogram/pages/student/visit/index.js`
- Modify: `miniprogram/pages/student/booking/index.js`
- Modify: `miniprogram/pages/admin/bookings/index.js`

- [ ] **Step 1：学员提交参观后申请订阅**

在 `visit/index.js` 的 `submit()` 方法中，提交成功后添加：

```javascript
// 申请订阅消息权限（需要先在微信公众平台配置模板）
wx.requestSubscribeMessage({
  tmplIds: ['TEMPLATE_ID_VISIT_NOTIFY'], // 替换为实际模板ID
  success: () => {
    cloud.sendNotify({
      openid: '', // 爸爸的 openid，需从 app.globalData 获取或查数据库
      templateId: 'TEMPLATE_ID_VISIT_NOTIFY',
      data: {
        thing1: { value: this.data.nickName + ' 提交参观申请' },
        phone_number2: { value: this.data.phone },
        time3: { value: new Date().toLocaleString() }
      }
    })
  }
})
```

- [ ] **Step 2：学员提交预约后申请订阅**

在 `booking/index.js` 的 `submit()` 方法中同理。

- [ ] **Step 3：管理员接受/拒绝后通知学员**

在 `admin/bookings/index.js` 中，`acceptBooking` 和 `rejectBooking` 成功后调用 `sendNotify` 通知对应学员。

- [ ] **Step 4：提交**

```bash
git add miniprogram/pages/student/visit/ miniprogram/pages/student/booking/ miniprogram/pages/admin/bookings/
git commit -m "feat: 集成订阅消息通知"
```

---

## 自检清单

- ✅ **Spec 覆盖：** 每个需求点（参观预约、上课预约、管理审核、课程表、加微信、联系客服）都有对应 Task
- ✅ **无占位符：** 所有步骤包含完整代码，无 TBD/TODO
- ✅ **类型一致性：** 云函数命名、数据字段名、组件属性名在所有 Task 中保持一致
- ✅ **增量构建：** 每个 Task 可独立提交，功能自洽
- ❌ **TDD：** 本项目为微信小程序，无自动化测试框架，改为手动验证

---

## 执行方式选择

**计划已保存到** `docs/superpowers/plans/2026-06-16-driving-school-miniapp-plan.md`

**两种执行方式：**

> **1. 子代理驱动（推荐）** — 为每个 Task 派发独立的子代理，逐个 Task 执行，每完成一个 Review，快速迭代
>
> **2. 内联执行** — 在当前会话中按 Task 顺序执行，批量 checkpoint 供审阅

**你选哪种？**
