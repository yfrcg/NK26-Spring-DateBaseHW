# 共享空间预约系统

这是一个前后端分离的共享空间预约管理项目，前端基于 `React + Vite + Ant Design`，后端基于 `Spring Boot + JPA + MySQL`。

## 功能概览

- 用户注册、登录、修改密码
- 空间浏览、按地点筛选、预约、签到、暂离、恢复、签退
- 账户充值、交易记录、账单查询
- 管理员用户管理、空间管理、预约管理、计费策略管理、信用管理
- 默认演示数据自动初始化，首次启动可直接体验完整流程

## 目录结构

- `db-frontend`
  前端项目
- `db-backend`
  后端项目
- `init.sql`
  数据库初始化脚本参考

## 启动方式

### 1. 启动后端

在 `db-backend` 目录执行：

```powershell
cd D:\WorkStation\Database_System\db-backend
.\mvnw.cmd spring-boot:run
```

可选环境变量：

```powershell
$env:DB_URL="jdbc:mysql://localhost:3306/shared_space_booking_db?createDatabaseIfNotExist=true&serverTimezone=Asia/Shanghai&characterEncoding=utf8&useSSL=false&allowPublicKeyRetrieval=true"
$env:DB_USERNAME="root"
$env:DB_PASSWORD="wys13389978139"
```

默认监听端口：`8080`

### 2. 启动前端

在 `db-frontend` 目录执行：

```powershell
cd D:\WorkStation\Database_System\db-frontend
npm install
npm run dev
```

默认访问地址：`http://localhost:5173`

前端已内置 `/api` 代理到 `http://localhost:8080`。

## 默认账号

当数据库里还没有管理员时，系统会自动创建一个默认管理员：

- 账号：`admin`
- 密码：`admin123456`

建议首次登录后立刻在“个人信息”页修改密码。

## 演示数据

后端启动时会自动补齐一组演示数据：

- 默认楼栋、区域、房间
- 免费策略与付费策略
- 3 个示例空间

这样在空库环境下也可以直接演示主流程。

## 质量检查

前端：

```powershell
npm run lint
npm run build
```

后端：

```powershell
.\mvnw.cmd test
```

## 当前实现说明

- 认证为 Bearer Token 方案
- 管理端接口已做后端鉴权
- 测试环境已切换为 H2 内存数据库，不依赖本地真实 MySQL

## 已知限制

- 当前 Token 存储在后端内存中，后端重启后需要重新登录
- 适合课程项目演示和单机部署，若要正式公网长期运行，建议继续补持久化会话或 JWT
