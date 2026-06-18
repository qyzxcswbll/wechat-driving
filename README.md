# 🚗 驾校预约小程序

微信原生小程序 + 微信云开发，供学员预约学车/参观，教练管理预约和课程表。

## 快速开始

```bash
# 克隆项目
git clone git@github.com:qyzxcswbll/wechat-driving.git

# 用微信开发者工具导入项目
# 目录指向 wechat-driving
# 填入你的 AppID
```

详细操作见 [`docs/deployment-guide.md`](docs/deployment-guide.md)

## 技术栈

- **前端：** 微信原生小程序 (wxml/wxss/js)
- **后端：** 微信云开发（云数据库 + 云函数 + 云存储）
- **云函数：** 18 个

## 页面结构

```
学员端                   管理端
├── 首页                 ├── 管理首页
├── 了解驾校             ├── 咨询学员
├── 预约学车             ├── 预约管理
├── 预约参观             └── 课程表
├── 我的预约
├── 预约详情
└── 联系我们
```

## 管理设置

首页右下角 ⚙️ → 密码 `ll3385569+`

- 学员管理（设为教练）
- APP名称 / 教练信息 / 微信二维码

## 文档

| 文档 | 说明 |
|------|------|
| [部署手册](docs/deployment-guide.md) | 从零到上线的完整操作步骤 |
| [项目进度](docs/progress.md) | 功能完成状态和待办事项 |
| [设计文档](docs/superpowers/specs/2026-06-16-driving-school-miniapp-design.md) | 原始设计规格 |
| [UI 设计稿](docs/ui-mockups/) | 日期选择器 / 课程表设计 |
