# 共享空间预约管理系统

一个基于 **React + FastAPI + MySQL** 的数据库课程设计项目。系统围绕共享自习室、工位、会议室等空间的预约业务展开，覆盖用户注册登录、空间浏览、在线预约、签到签退、暂离管理、账单结算、账户充值、信用分管理和后台运营看板。

## 项目概览

| 模块 | 技术选型 |
| --- | --- |
| 前端 | React 19, TypeScript, Vite, Ant Design, Zustand, Recharts |
| 后端 | Python 3.11+, FastAPI, SQLAlchemy 2.0, Pydantic |
| 数据库 | MySQL 8.0, InnoDB, utf8mb4 |
| 认证 | Bearer Token, 内存会话 |
| 设计主题 | 蓝青色后台管理系统，含自定义登录页与运营驾驶舱 |

## 核心功能

### 用户端

- 注册、登录、退出、修改密码
- 浏览共享空间，并按楼宇、区域、房间筛选
- 在线提交预约，系统自动记录计费策略快照
- 查看个人预约记录，执行取消预约、签到、暂离、恢复、签退
- 查询账户余额、充值记录、消费流水和账单
- 查看信用分及信用事件记录

### 管理端

- 用户管理：查询、停用、启用
- 空间管理：上架、下架、维护状态切换
- 预约管理：查看全量预约、后台取消异常预约
- 计费策略管理：新增、编辑、启用、禁用、软删除
- 信用管理：手动调整信用分并记录流水
- 运营看板：今日预约、签到、收入、未结清账单、热门空间和信用事件统计

## 数据库设计

当前 `init.sql` 是精简版建库脚本，包含 **9 张业务表 + 3 个视图**。

### 核心表

| 表名 | 说明 |
| --- | --- |
| `users` | 用户与账户合并表，保存身份、余额、欠费、累计消费和信用分 |
| `locations` | 场地位置树，支持 BUILDING、ZONE、ROOM 三级结构 |
| `pricing_policies` | 计费策略，支持免费、按小时计费、超时倍率和暂离规则 |
| `spaces` | 可预约空间，支持座位、工位、房间、办公室 |
| `reservations` | 预约记录，保存预约状态和策略快照 |
| `space_time_locks` | 时间段锁，防止同一空间同一时间重复预约 |
| `usage_sessions` | 使用会话，记录签到、签退、暂离和超时信息 |
| `billing_orders` | 账单，记录基础费用、超时费用、折扣和支付状态 |
| `user_transactions` | 用户资金流水与信用流水统一表 |

### 视图

| 视图 | 说明 |
| --- | --- |
| `v_active_users` | 当前有效用户视图 |
| `v_active_spaces` | 当前可预约空间视图 |
| `v_reservation_detail` | 预约详情聚合视图 |

## 项目结构

```text
Database_System/
├─ db-backend/                 # FastAPI 后端
│  ├─ app/
│  │  ├─ models/               # SQLAlchemy ORM 模型
│  │  ├─ schemas/              # Pydantic 请求与响应模型
│  │  ├─ services/             # 业务逻辑
│  │  ├─ routers/              # API 路由
│  │  ├─ config.py             # 配置读取
│  │  ├─ database.py           # 数据库连接
│  │  └─ main.py               # FastAPI 入口
│  └─ requirements.txt
├─ db-frontend/                # React 前端
│  ├─ src/
│  │  ├─ api/                  # API 请求封装
│  │  ├─ assets/               # 前端视觉资产
│  │  ├─ components/           # 公共组件
│  │  ├─ layouts/              # 登录布局与主后台布局
│  │  ├─ pages/                # 业务页面
│  │  ├─ stores/               # Zustand 状态管理
│  │  └─ types/                # TypeScript 类型
│  └─ vite.config.ts
├─ init.sql                    # MySQL 初始化脚本
└─ README.md
```

## 快速启动

### 1. 准备环境

- Python 3.11+
- Node.js 18+
- MySQL 8.0+

### 2. 初始化数据库

```bash
mysql -u root -p < init.sql
```

如果本地 MySQL 账号或密码不同，请在 `db-backend/.env` 文件中覆盖配置：

```env
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=shared_space_booking_db
```

### 3. 启动后端

```bash
cd db-backend
pip install -r requirements.txt
python -m uvicorn app.main:app --host 127.0.0.1 --port 8000 --reload
```

后端启动后可访问：

- API 根路径：http://127.0.0.1:8000
- Swagger 文档：http://127.0.0.1:8000/docs

系统启动时会自动创建默认管理员：

```text
账号：admin
密码：admin123456
```

初始化脚本已内置演示数据，包括学生、教师、教学楼/区域/房间、计费策略、空间、预约、签到会话、账单和资金/信用流水。普通演示账号采用“账号号=密码”的兼容登录规则：

| 账号 | 密码 | 角色 | 说明 |
| --- | --- | --- | --- |
| `S20260001` | `S20260001` | 学生 | 有余额，完成过免费自习预约 |
| `S20260002` | `S20260002` | 学生 | 有未来预约和信用扣分记录 |
| `T20260001` | `T20260001` | 教师 | 有已结清的研讨室账单 |
| `S20260003` | `S20260003` | 学生 | 欠费锁定，用于演示异常账户 |

### 4. 启动前端

```bash
cd db-frontend
npm install
npm run dev
```

前端默认访问地址：

```text
http://127.0.0.1:5173
```

Vite 已配置 `/api` 代理到后端 `http://localhost:8000`。

## 常用 API

| 模块 | 路由前缀 | 说明 |
| --- | --- | --- |
| 认证 | `/api/auth` | 登录、注册、当前用户、修改密码、退出 |
| 用户 | `/api/users` | 用户创建、查询和个人信息 |
| 账户 | `/api/users/{user_id}/account` | 余额、充值、资金流水 |
| 场地 | `/api/locations` | 场地树、按场地查询空间 |
| 空间 | `/api/spaces` | 可用空间列表 |
| 预约 | `/api/reservations` | 创建预约、查询预约、取消预约 |
| 使用会话 | `/api/sessions` | 签到、暂离、恢复、签退 |
| 账单 | `/api/bills` | 按用户或预约查询账单 |
| 信用 | `/api/credits` | 信用记录和信用分调整 |
| 报表 | `/api/reports` | Dashboard、热门空间、信用事件统计 |
| 管理 | `/api/admin` | 管理员专用用户、空间、预约、策略、信用接口 |

## 业务流程

```text
用户登录
  → 浏览可用空间
  → 选择日期和时间段
  → 提交预约
  → 系统写入预约记录并锁定时间段
  → 用户签到开始使用
  → 可暂离并恢复
  → 用户签退
  → 系统生成账单并扣款
  → 余额不足时记录欠费并锁定账户
```

## 质量检查

### 前端

```bash
cd db-frontend
npm run build
```

### 后端

```bash
cd db-backend
python -m compileall app
```

## 开发说明

- 当前数据库设计以 `init.sql` 为准。
- 后端不会自动迁移旧结构数据库，修改表结构后需要重新执行 `init.sql`。
- 如果前端出现 502，通常是后端 `8000` 端口未启动，或 Vite 代理无法连接后端。
- 如果登录时报数据库字段缺失，请确认当前库是由最新 `init.sql` 初始化的。

## 课程设计要点

- 使用外键、唯一约束、检查约束和索引表达业务规则。
- 使用时间段锁表解决空间预约冲突。
- 将预约计费策略做快照，避免策略变更影响历史预约。
- 将资金流水和信用流水合并到统一交易表，减少表数量并保留审计能力。
- 前后端分离，接口返回统一 `Result<T>` 结构。
