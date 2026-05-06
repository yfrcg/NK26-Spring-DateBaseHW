# 共享空间预约管理系统（Shared Space Booking System）

一个基于 **前后端分离** 架构的共享空间预约管理系统，支持空间预约、签到签退、信用分管理、账户充值与自动结算等完整业务流程。

## 技术栈

| 层级 | 技术选型 |
|------|----------|
| 前端 | React 19 + TypeScript + Vite + Ant Design 5 + Zustand |
| 后端 | Python 3.11+ + FastAPI + SQLAlchemy 2.0 + Pydantic |
| 数据库 | MySQL 8.0 |
| 认证 | Bearer Token（内存会话） |

## 功能特性

### 用户端
- 注册、登录、修改密码
- 浏览空间列表，按地点（楼栋/区域/房间）筛选
- 在线预约空间，查看预约记录
- 签到 → 暂时离开 → 恢复 → 签退完整使用流程
- 账户充值、交易流水查询、账单查看
- 信用分记录查看

### 管理端
- 用户管理（停用/启用）
- 空间管理（上架/下架/维护）
- 预约管理（查看/取消）
- 计费策略管理（启用/禁用）
- 信用分手动调整
- 运营数据看板（今日预约数、签到数、收入、欠费账单数等）

## 项目结构

```
Database_System/
├── db-frontend/          # 前端项目（React + Vite + Ant Design）
│   ├── src/
│   │   ├── api/          # API 请求封装
│   │   ├── components/   # 公共组件
│   │   ├── layouts/      # 布局组件
│   │   ├── pages/        # 页面组件
│   │   ├── stores/       # Zustand 状态管理
│   │   └── types/        # TypeScript 类型定义
│   └── vite.config.ts
├── db-backend-py/        # 后端项目（Python + FastAPI）
│   ├── app/
│   │   ├── models/       # SQLAlchemy 数据库模型（12张表）
│   │   ├── schemas/      # Pydantic 请求/响应模型
│   │   ├── services/     # 业务逻辑层
│   │   ├── routers/      # API 路由
│   │   ├── deps.py       # 依赖注入（认证、权限）
│   │   ├── config.py     # 配置管理
│   │   ├── database.py   # 数据库连接
│   │   └── main.py       # FastAPI 应用入口
│   └── requirements.txt
├── init.sql              # 数据库初始化脚本
└── README.md
```

## 数据库设计

系统包含 12 张核心数据表：

| 表名 | 说明 |
|------|------|
| `users` | 用户表（学生/教师/管理员） |
| `user_accounts` | 用户账户（余额、冻结、欠费） |
| `account_transactions` | 账户流水（充值/消费/退款） |
| `locations` | 场地位置（楼栋/区域/房间三级树形） |
| `pricing_policies` | 计费策略（免费/按时计费、临时占座规则） |
| `spaces` | 空间（座位/工位/房间/办公室） |
| `reservations` | 预约记录（含策略快照） |
| `space_time_locks` | 空间时段锁（防冲突预约） |
| `usage_sessions` | 使用会话（签到/暂离/签退） |
| `billing_orders` | 账单（基础费+超时费-折扣） |
| `credit_transactions` | 信用分变动记录 |
| `space_runtime_status` | 空间实时状态 |

ER 图可参考 `init.sql` 中的建表语句。

## 快速启动

### 前置条件
- Python 3.11+
- Node.js 18+
- MySQL 8.0

### 1. 初始化数据库

```bash
mysql -u root -p < init.sql
```

### 2. 启动后端

```bash
cd db-backend-py
pip install -r requirements.txt
uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload
```

后端启动后：
- API 服务：http://localhost:8000
- Swagger 文档：http://localhost:8000/docs
- 系统会自动创建默认管理员账号（admin / admin123456）

### 3. 启动前端

```bash
cd db-frontend
npm install
npm run dev
```

前端访问：http://localhost:5173（已配置 `/api` 代理到后端 8000 端口）

### 4. 登录体验

- 管理员：`admin` / `admin123456`
- 首次登录后建议在"个人信息"页修改密码

## 核心业务流程

```
用户注册/登录
    ↓
浏览空间 → 选择时间 → 提交预约
    ↓
预约成功（时段锁锁定）
    ↓
到店签到 → 使用中 → 暂时离开 → 恢复 → 签退
    ↓
系统自动计算费用 → 账户余额自动扣款
    ↓
余额不足 → 欠费锁定 → 充值后自动解锁
```

## API 概览

| 模块 | 端点前缀 | 说明 |
|------|----------|------|
| 认证 | `/api/auth` | 登录、注册、获取当前用户、改密、登出 |
| 用户 | `/api/users` | 用户 CRUD |
| 账户 | `/api/accounts` | 查询余额、充值、交易流水 |
| 场地 | `/api/locations` | 场地树、按场地查空间 |
| 空间 | `/api/spaces` | 空间列表 |
| 预约 | `/api/reservations` | 创建预约、查预约、取消预约 |
| 会话 | `/api/sessions` | 签到、暂离、恢复、签退 |
| 账单 | `/api/bills` | 按预约/用户查账单 |
| 信用 | `/api/credits` | 信用记录、手动调整 |
| 报表 | `/api/reports` | Dashboard、热门空间、信用事件统计 |
| 运行时 | `/api/runtime` | 空间实时状态 |
| 管理 | `/api/admin` | 管理员专用接口 |

## 质量检查

前端：

```bash
cd db-frontend
npm run lint
npm run build
```
