# 驾校预约小程序 · 项目进度

> 最后更新：2026-06-29
> 分支：`feature/driving-school-miniapp`
> 最新 Tag：`v0.1.0`

---

## ✅ 已完成

### 1. 项目框架
- [x] 微信原生小程序 + 微信云开发
- [x] 全局主题样式 / 项目配置
- [x] 自定义底部导航组件 + 状态标签组件
- [x] 云函数调用封装 (cloud.js)

### 2. 云函数（共 19 个）
| 云函数 | 说明 |
|--------|------|
| `login` | 微信登录 + 身份识别（管理员/学员） |
| `getSchoolInfo` / `getVisits` / `getMyVisits` | 驾校信息 / 参观咨询 |
| `submitVisit` | 提交参观（含手机号保存到学员档案，同步 nickName） |
| `markContacted` | 标记已联系 |
| `submitBooking` | 批量提交预约（含手机号保存、通知教练，同步 nickName） |
| `getMyBookings` / `getAllBookings` | 学员/管理员获取预约 |
| `handleBooking` | 接受/拒绝预约 |
| `getSchedule` | 获取课程表（按日期分组） |
| `cancelBooking` | 学员取消预约（含通知教练） |
| `sendNotify` | 发送订阅消息 |
| `setupVerify` / `setupGetAllStudents` / `setupGetAdmins` | 管理设置 |
| `setupSetAdmin` / `setupRemoveAdmin` | 设/取消教练权限 |
| `setupUpdateSchool` | 驾校信息更新 |

### 3. 学员端页面（7 页）
| 页面 | 功能 |
|------|------|
| 🚗 首页 | APP名称/地址/教练/电话展示、功能入口、⚙️设置入口 |
| 📋 了解驾校 | 驾校介绍、地址、教练信息、拨打电话、预约参观 |
| 📅 预约学车 | 多日期批量预约、系统时间选择器、科目/挡位、称呼(选填默认昵称)+手机号必填、隐私政策勾选 |
| 📋 预约参观 | 称呼(选填默认昵称)+手机号+备注、隐私政策勾选、提交后保存联系方式 |
| 📍 我的预约 | Tab分类(上课预约/参观咨询)、状态标签、待确认可取消 |
| 📄 预约详情 | 完整信息展示（状态/日期/时间/科目/备注/回复） |
| 💬 联系我们 | 微信二维码、复制微信号、拨打电话、联系客服 |

### 4. 管理端页面（4 页）
| 页面 | 功能 |
|------|------|
| 📊 管理首页 | 数据概览(待处理/咨询/已确认)、快捷导航、⚙️管理设置入口 |
| 🙋 咨询学员 | 参观咨询列表、标记已联系、拨打电话 |
| 📋 预约管理 | 筛选(全部/待处理/已接受/已拒绝)、接受/拒绝(含原因)、同时段人数提示 |
| 📅 课程表 | 61天可滑动日期条+月份跳转、按时间分组、姓名标签点看详情、📞拨打电话 |

### 5. 其他页面
| 页面 | 功能 |
|------|------|
| 🔐 管理设置 | 密码验证、学员列表分页加载、设为教练/取消教练、驾校信息编辑、微信二维码上传教程 |
| 🚀 启动页 | 自动登录(失败显示重试按钮) |
| 📄 隐私政策 | 信息收集/使用/存储/共享说明、用户权利 |

### 6. 分享功能
- [x] 所有页面支持右上角「转发给朋友」
- [x] 所有页面支持右上角「分享到朋友圈」

### 6. 通知系统
- [x] 学员提交预约/参观 → 通知教练（模板：订阅项目进展更新提醒）
- [x] 教练接受/拒绝 → 通知学员（同一模板）
- [x] 学员取消预约 → 通知教练
- [x] 启动时自动请求授权，提交前再次请求

### 7. 设计稿
- [x] 日期时间选择器方案 D（`docs/ui-mockups/date-picker-options.html`）
- [x] 课程表设计稿（`docs/ui-mockups/schedule-design.html`）

---

## 🔄 当前状态

| 阶段 | 状态 | 说明 |
|------|------|------|
| ✅ 代码开发 | 已完成 | v0.1.0，已打 tag 推送 |
| ✅ 备案 | 已通过 | 个人主体，工具-信息查询类目 |
| ✅ 发布上线 | 已发布 | 用户可搜索"轻松上路"使用 |
| ⏳ 1.0.3 审核 | 审核中 | 昵称获取修复、分享/转发权限、隐私政策合规整改 |

### 已部署的云函数
- `login` / `getSchoolInfo` / `submitVisit` / `submitBooking`
- `getVisits` / `getMyVisits` / `markContacted`
- `getMyBookings` / `getAllBookings` / `handleBooking` / `cancelBooking`
- `getSchedule` / `sendNotify`
- `setupVerify` / `setupGetAllStudents` / `setupGetAdmins`
- `setupSetAdmin` / `setupRemoveAdmin` / `setupUpdateSchool`

### 待部署云函数（审核通过后）
- `submitVisit`（新增 nickName 同步）
- `submitBooking`（新增 nickName 同步）

---

## 📁 项目结构

```
wechat-driving/
├── cloudfunctions/          # 19 个云函数
├── miniprogram/
│   ├── pages/
│   │   ├── student/ (7)    # 学员端页面
│   │   ├── admin/ (4)      # 管理端页面
│   │   ├── privacy/        # 隐私政策
│   │   ├── splash/         # 启动页
│   │   └── setup/          # 设置页
│   ├── components/ (2)     # nav-bar, status-badge
│   ├── utils/              # cloud.js 工具类
│   └── app.js/wxss/json   # 全局入口
├── docs/
│   ├── superpowers/specs/  # 设计文档
│   ├── superpowers/plans/  # 实施计划
│   ├── deployment-guide.md # 部署手册
│   └── progress.md         # 本文件
└── project.config.json
```
