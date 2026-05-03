-- =========================================================
-- 智能共享自习室 / 办公空间预约与计费管理系统
-- MySQL 8.0 完整建库脚本（12表 + 4视图）
-- =========================================================

DROP DATABASE IF EXISTS shared_space_booking_db;
CREATE DATABASE shared_space_booking_db
  DEFAULT CHARACTER SET utf8mb4
  DEFAULT COLLATE utf8mb4_0900_ai_ci;

USE shared_space_booking_db;

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

-- =========================================================
-- 1. 用户表 users
-- 说明：
--   1) 强实体
--   2) 单表继承：STUDENT / TEACHER / ADMIN
--   3) 统一审计字段 + 软删除
-- =========================================================
CREATE TABLE users (
    user_id              BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY COMMENT '用户主键',
    user_no              VARCHAR(32) NOT NULL COMMENT '学号/工号/用户编号',
    real_name            VARCHAR(50) NOT NULL COMMENT '真实姓名',
    phone                VARCHAR(20) NULL COMMENT '手机号',
    email                VARCHAR(100) NULL COMMENT '邮箱',
    user_type            ENUM('STUDENT', 'TEACHER', 'ADMIN') NOT NULL DEFAULT 'STUDENT' COMMENT '用户子类型',
    account_status       ENUM('ACTIVE', 'SUSPENDED', 'ARREARS_LOCKED') NOT NULL DEFAULT 'ACTIVE' COMMENT '账号状态',
    credit_score         INT NOT NULL DEFAULT 100 COMMENT '当前信用分',
    last_login_time      DATETIME NULL COMMENT '最近登录时间',

    created_at           DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    updated_at           DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
    is_deleted           TINYINT(1) NOT NULL DEFAULT 0 COMMENT '是否逻辑删除',
    deleted_at           DATETIME NULL COMMENT '逻辑删除时间',
    deleted_by           BIGINT UNSIGNED NULL COMMENT '逻辑删除操作人',

    CONSTRAINT uq_users_user_no UNIQUE (user_no),
    CONSTRAINT uq_users_phone UNIQUE (phone),
    CONSTRAINT uq_users_email UNIQUE (email),

    CONSTRAINT chk_users_credit_score CHECK (credit_score BETWEEN 0 AND 1000),
    CONSTRAINT chk_users_is_deleted CHECK (is_deleted IN (0, 1)),

    CONSTRAINT fk_users_deleted_by
        FOREIGN KEY (deleted_by) REFERENCES users(user_id)
        ON UPDATE CASCADE
        ON DELETE SET NULL
) ENGINE=InnoDB COMMENT='用户表';

CREATE INDEX idx_users_type_status
    ON users(user_type, account_status);

CREATE INDEX idx_users_deleted_status
    ON users(is_deleted, account_status);

-- =========================================================
-- 2. 用户账户表 user_accounts
-- 说明：
--   1) 与 users 共享主键的一对一依赖实体
--   2) 专门承载账户余额、冻结、欠费等财务状态
-- =========================================================
CREATE TABLE user_accounts (
    user_id              BIGINT UNSIGNED PRIMARY KEY COMMENT '用户ID，同时也是账户ID',
    balance              DECIMAL(12,2) NOT NULL DEFAULT 0.00 COMMENT '当前余额',
    frozen_amount        DECIMAL(12,2) NOT NULL DEFAULT 0.00 COMMENT '冻结金额',
    arrears_amount       DECIMAL(12,2) NOT NULL DEFAULT 0.00 COMMENT '欠费金额',
    total_recharge       DECIMAL(12,2) NOT NULL DEFAULT 0.00 COMMENT '累计充值',
    total_spend          DECIMAL(12,2) NOT NULL DEFAULT 0.00 COMMENT '累计消费',
    version_no           INT NOT NULL DEFAULT 0 COMMENT '乐观锁版本号',
    last_settlement_time DATETIME NULL COMMENT '最近结算时间',

    created_at           DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    updated_at           DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',

    CONSTRAINT chk_user_accounts_balance CHECK (balance >= 0),
    CONSTRAINT chk_user_accounts_frozen CHECK (frozen_amount >= 0),
    CONSTRAINT chk_user_accounts_arrears CHECK (arrears_amount >= 0),
    CONSTRAINT chk_user_accounts_total_recharge CHECK (total_recharge >= 0),
    CONSTRAINT chk_user_accounts_total_spend CHECK (total_spend >= 0),
    CONSTRAINT chk_user_accounts_version_no CHECK (version_no >= 0),

    CONSTRAINT fk_user_accounts_user
        FOREIGN KEY (user_id) REFERENCES users(user_id)
        ON UPDATE CASCADE
        ON DELETE RESTRICT
) ENGINE=InnoDB COMMENT='用户账户表（共享主键1:1）';

-- =========================================================
-- 3. 场地表 locations
-- 说明：
--   1) 递归层级结构：BUILDING / ZONE / ROOM
--   2) 自引用体现递归关系
-- =========================================================
CREATE TABLE locations (
    location_id          BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY COMMENT '场地主键',
    parent_location_id   BIGINT UNSIGNED NULL COMMENT '父场地ID，自引用',
    location_code        VARCHAR(30) NOT NULL COMMENT '场地编码',
    location_name        VARCHAR(100) NOT NULL COMMENT '场地名称',
    location_type        ENUM('BUILDING', 'ZONE', 'ROOM') NOT NULL COMMENT '场地类型',
    floor_no             VARCHAR(10) NULL COMMENT '楼层号',
    room_no              VARCHAR(20) NULL COMMENT '房间号',
    open_time            TIME NOT NULL DEFAULT '08:00:00' COMMENT '开放时间',
    close_time           TIME NOT NULL DEFAULT '22:00:00' COMMENT '关闭时间',
    status               ENUM('ACTIVE', 'INACTIVE') NOT NULL DEFAULT 'ACTIVE' COMMENT '场地状态',
    remarks              VARCHAR(255) NULL COMMENT '备注',

    created_at           DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    updated_at           DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
    is_deleted           TINYINT(1) NOT NULL DEFAULT 0 COMMENT '是否逻辑删除',
    deleted_at           DATETIME NULL COMMENT '逻辑删除时间',
    deleted_by           BIGINT UNSIGNED NULL COMMENT '逻辑删除操作人',

    CONSTRAINT uq_locations_code UNIQUE (location_code),
    CONSTRAINT chk_locations_is_deleted CHECK (is_deleted IN (0, 1)),
    CONSTRAINT chk_locations_business_time CHECK (close_time > open_time),

    CONSTRAINT fk_locations_parent
        FOREIGN KEY (parent_location_id) REFERENCES locations(location_id)
        ON UPDATE CASCADE
        ON DELETE RESTRICT,

    CONSTRAINT fk_locations_deleted_by
        FOREIGN KEY (deleted_by) REFERENCES users(user_id)
        ON UPDATE CASCADE
        ON DELETE SET NULL
) ENGINE=InnoDB COMMENT='场地表（递归层级）';

CREATE INDEX idx_locations_parent
    ON locations(parent_location_id);

CREATE INDEX idx_locations_type_status
    ON locations(location_type, status);

CREATE INDEX idx_locations_deleted
    ON locations(is_deleted, status);

-- =========================================================
-- 4. 计费策略表 pricing_policies
-- 说明：
--   1) 单表继承：FREE / PAID
--   2) 支持免费区与收费区共存
--   3) 增加有效期与临时占座策略
-- =========================================================
CREATE TABLE pricing_policies (
    policy_id                  BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY COMMENT '策略主键',
    policy_code                VARCHAR(30) NOT NULL COMMENT '策略编码',
    policy_name                VARCHAR(100) NOT NULL COMMENT '策略名称',
    charge_mode                ENUM('FREE', 'PAID') NOT NULL COMMENT '计费模式',
    hourly_price               DECIMAL(10,2) NOT NULL DEFAULT 0.00 COMMENT '小时单价',
    free_minutes               INT NOT NULL DEFAULT 0 COMMENT '免费分钟数',
    max_reserve_hours          INT NOT NULL DEFAULT 4 COMMENT '最大预约时长（小时）',
    deposit_amount             DECIMAL(10,2) NOT NULL DEFAULT 0.00 COMMENT '押金',
    overtime_price_multiplier  DECIMAL(5,2) NOT NULL DEFAULT 1.50 COMMENT '超时计费倍率',
    allow_temp_hold            TINYINT(1) NOT NULL DEFAULT 0 COMMENT '是否允许临时占座',
    temp_hold_limit_minutes    INT NOT NULL DEFAULT 0 COMMENT '单次临时占座允许分钟数',
    temp_hold_max_count        INT NOT NULL DEFAULT 0 COMMENT '单次使用最多临时占座次数',
    is_active                  TINYINT(1) NOT NULL DEFAULT 1 COMMENT '是否启用',
    valid_from                 DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '生效开始时间',
    valid_to                   DATETIME NULL COMMENT '生效结束时间',
    remarks                    VARCHAR(255) NULL COMMENT '备注',

    created_at                 DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    updated_at                 DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
    is_deleted                 TINYINT(1) NOT NULL DEFAULT 0 COMMENT '是否逻辑删除',
    deleted_at                 DATETIME NULL COMMENT '逻辑删除时间',
    deleted_by                 BIGINT UNSIGNED NULL COMMENT '逻辑删除操作人',

    CONSTRAINT uq_pricing_policies_code UNIQUE (policy_code),
    CONSTRAINT uq_pricing_policies_name UNIQUE (policy_name),

    CONSTRAINT chk_pricing_hourly_price CHECK (hourly_price >= 0),
    CONSTRAINT chk_pricing_free_minutes CHECK (free_minutes >= 0),
    CONSTRAINT chk_pricing_max_reserve_hours CHECK (max_reserve_hours > 0),
    CONSTRAINT chk_pricing_deposit_amount CHECK (deposit_amount >= 0),
    CONSTRAINT chk_pricing_overtime_multiplier CHECK (overtime_price_multiplier >= 1.00),
    CONSTRAINT chk_pricing_allow_temp_hold CHECK (allow_temp_hold IN (0, 1)),
    CONSTRAINT chk_pricing_temp_hold_limit_minutes CHECK (temp_hold_limit_minutes >= 0),
    CONSTRAINT chk_pricing_temp_hold_max_count CHECK (temp_hold_max_count >= 0),
    CONSTRAINT chk_pricing_is_active CHECK (is_active IN (0, 1)),
    CONSTRAINT chk_pricing_is_deleted CHECK (is_deleted IN (0, 1)),
    CONSTRAINT chk_pricing_valid_range CHECK (valid_to IS NULL OR valid_to > valid_from),

    CONSTRAINT chk_pricing_mode_price CHECK (
        (charge_mode = 'FREE' AND hourly_price = 0.00)
        OR
        (charge_mode = 'PAID' AND hourly_price >= 0.00)
    ),

    CONSTRAINT chk_pricing_temp_hold_rule CHECK (
        (allow_temp_hold = 0 AND temp_hold_limit_minutes = 0 AND temp_hold_max_count = 0)
        OR
        (allow_temp_hold = 1 AND temp_hold_limit_minutes > 0 AND temp_hold_max_count > 0)
    ),

    CONSTRAINT fk_pricing_policies_deleted_by
        FOREIGN KEY (deleted_by) REFERENCES users(user_id)
        ON UPDATE CASCADE
        ON DELETE SET NULL
) ENGINE=InnoDB COMMENT='计费策略表';

CREATE INDEX idx_pricing_mode_active
    ON pricing_policies(charge_mode, is_active);

CREATE INDEX idx_pricing_deleted
    ON pricing_policies(is_deleted, is_active);

-- =========================================================
-- 5. 空间表 spaces
-- 说明：
--   1) 强实体
--   2) 单表继承：SEAT / DESK / ROOM / OFFICE
--   3) 只表达静态资源状态，不表达当前占用态
-- =========================================================
CREATE TABLE spaces (
    space_id              BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY COMMENT '空间主键',
    location_id           BIGINT UNSIGNED NOT NULL COMMENT '所属场地ID',
    policy_id             BIGINT UNSIGNED NOT NULL COMMENT '绑定计费策略ID',
    space_code            VARCHAR(30) NOT NULL COMMENT '空间编码',
    space_name            VARCHAR(100) NOT NULL COMMENT '空间名称',
    space_type            ENUM('SEAT', 'DESK', 'ROOM', 'OFFICE') NOT NULL COMMENT '空间类型',
    capacity              INT NOT NULL DEFAULT 1 COMMENT '容量',
    equipment_desc        VARCHAR(255) NULL COMMENT '设备说明',
    status                ENUM('ACTIVE', 'MAINTENANCE', 'DISABLED') NOT NULL DEFAULT 'ACTIVE' COMMENT '静态资源状态',
    sort_no               INT NOT NULL DEFAULT 0 COMMENT '排序号',

    created_at            DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    updated_at            DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
    is_deleted            TINYINT(1) NOT NULL DEFAULT 0 COMMENT '是否逻辑删除',
    deleted_at            DATETIME NULL COMMENT '逻辑删除时间',
    deleted_by            BIGINT UNSIGNED NULL COMMENT '逻辑删除操作人',

    CONSTRAINT uq_spaces_location_code UNIQUE (location_id, space_code),
    CONSTRAINT chk_spaces_capacity_positive CHECK (capacity > 0),
    CONSTRAINT chk_spaces_is_deleted CHECK (is_deleted IN (0, 1)),
    CONSTRAINT chk_spaces_capacity_rule CHECK (
        ((space_type IN ('SEAT', 'DESK')) AND capacity = 1)
        OR
        ((space_type IN ('ROOM', 'OFFICE')) AND capacity >= 1)
    ),

    CONSTRAINT fk_spaces_location
        FOREIGN KEY (location_id) REFERENCES locations(location_id)
        ON UPDATE CASCADE
        ON DELETE RESTRICT,

    CONSTRAINT fk_spaces_policy
        FOREIGN KEY (policy_id) REFERENCES pricing_policies(policy_id)
        ON UPDATE CASCADE
        ON DELETE RESTRICT,

    CONSTRAINT fk_spaces_deleted_by
        FOREIGN KEY (deleted_by) REFERENCES users(user_id)
        ON UPDATE CASCADE
        ON DELETE SET NULL
) ENGINE=InnoDB COMMENT='空间/工位表';

CREATE INDEX idx_spaces_location_status
    ON spaces(location_id, status);

CREATE INDEX idx_spaces_policy_status
    ON spaces(policy_id, status);

CREATE INDEX idx_spaces_deleted
    ON spaces(is_deleted, status);

-- =========================================================
-- 6. 预约表 reservations
-- 说明：
--   1) Users 与 Spaces 的 M:N 关系实体化结果
--   2) 不是简单桥表，而是带有时间、状态、价格快照的关联实体
-- =========================================================
CREATE TABLE reservations (
    reservation_id               BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY COMMENT '预约主键',
    reservation_no               VARCHAR(40) NOT NULL COMMENT '预约编号',
    user_id                      BIGINT UNSIGNED NOT NULL COMMENT '预约用户',
    space_id                     BIGINT UNSIGNED NOT NULL COMMENT '预约空间',
    policy_id                    BIGINT UNSIGNED NOT NULL COMMENT '预约时采用的策略ID',
    reservation_type             ENUM('ONLINE', 'ADMIN') NOT NULL DEFAULT 'ONLINE' COMMENT '预约创建方式',
    start_time                   DATETIME NOT NULL COMMENT '预约开始时间',
    end_time                     DATETIME NOT NULL COMMENT '预约结束时间',
    reservation_status           ENUM('PENDING', 'CONFIRMED', 'CANCELLED', 'IN_USE', 'FINISHED', 'NO_SHOW') NOT NULL DEFAULT 'CONFIRMED' COMMENT '预约状态',

    charge_mode_snapshot         ENUM('FREE', 'PAID') NOT NULL COMMENT '策略快照：计费模式',
    hourly_price_snapshot        DECIMAL(10,2) NOT NULL DEFAULT 0.00 COMMENT '策略快照：小时单价',
    free_minutes_snapshot        INT NOT NULL DEFAULT 0 COMMENT '策略快照：免费分钟数',
    max_reserve_hours_snapshot   INT NOT NULL COMMENT '策略快照：最大预约时长',
    deposit_amount_snapshot      DECIMAL(10,2) NOT NULL DEFAULT 0.00 COMMENT '策略快照：押金',
    overtime_multiplier_snapshot DECIMAL(5,2) NOT NULL DEFAULT 1.50 COMMENT '策略快照：超时倍率',
    amount_estimated             DECIMAL(10,2) NOT NULL DEFAULT 0.00 COMMENT '预计金额',

    cancel_reason                VARCHAR(255) NULL COMMENT '取消原因',
    cancel_time                  DATETIME NULL COMMENT '取消时间',

    created_at                   DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    updated_at                   DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',

    CONSTRAINT uq_reservations_no UNIQUE (reservation_no),

    CONSTRAINT chk_reservations_time CHECK (end_time > start_time),
    CONSTRAINT chk_reservations_hourly_price_snapshot CHECK (hourly_price_snapshot >= 0),
    CONSTRAINT chk_reservations_free_minutes_snapshot CHECK (free_minutes_snapshot >= 0),
    CONSTRAINT chk_reservations_max_hours_snapshot CHECK (max_reserve_hours_snapshot > 0),
    CONSTRAINT chk_reservations_deposit_snapshot CHECK (deposit_amount_snapshot >= 0),
    CONSTRAINT chk_reservations_overtime_multiplier_snapshot CHECK (overtime_multiplier_snapshot >= 1.00),
    CONSTRAINT chk_reservations_amount_estimated CHECK (amount_estimated >= 0),

    CONSTRAINT fk_reservations_user
        FOREIGN KEY (user_id) REFERENCES users(user_id)
        ON UPDATE CASCADE
        ON DELETE RESTRICT,

    CONSTRAINT fk_reservations_space
        FOREIGN KEY (space_id) REFERENCES spaces(space_id)
        ON UPDATE CASCADE
        ON DELETE RESTRICT,

    CONSTRAINT fk_reservations_policy
        FOREIGN KEY (policy_id) REFERENCES pricing_policies(policy_id)
        ON UPDATE CASCADE
        ON DELETE RESTRICT
) ENGINE=InnoDB COMMENT='预约表（M:N关联实体）';

CREATE INDEX idx_reservations_user_status
    ON reservations(user_id, reservation_status, created_at);

CREATE INDEX idx_reservations_space_time
    ON reservations(space_id, reservation_status, start_time, end_time);

CREATE INDEX idx_reservations_policy
    ON reservations(policy_id);

-- =========================================================
-- 7. 时段锁表 space_time_locks
-- 说明：
--   1) 时态关系表
--   2) 保存“会影响冲突判断”的热数据锁片段
--   3) 一条预约允许存在多个锁片段（segment）
-- =========================================================
CREATE TABLE space_time_locks (
    lock_id               BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY COMMENT '锁主键',
    space_id              BIGINT UNSIGNED NOT NULL COMMENT '空间ID',
    reservation_id        BIGINT UNSIGNED NOT NULL COMMENT '预约ID',
    lock_segment_no       INT NOT NULL DEFAULT 1 COMMENT '锁片段序号',
    lock_type             ENUM('RESERVATION', 'TEMP_HOLD') NOT NULL COMMENT '锁类型',
    lock_start_time       DATETIME NOT NULL COMMENT '锁开始时间',
    lock_end_time         DATETIME NOT NULL COMMENT '锁结束时间',
    lock_status           ENUM('ACTIVE', 'RELEASED', 'EXPIRED') NOT NULL DEFAULT 'ACTIVE' COMMENT '锁状态',

    created_at            DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    updated_at            DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',

    CONSTRAINT uq_space_time_locks_segment UNIQUE (reservation_id, lock_segment_no),
    CONSTRAINT chk_space_time_locks_segment_no CHECK (lock_segment_no > 0),
    CONSTRAINT chk_space_time_locks_time CHECK (lock_end_time > lock_start_time),

    CONSTRAINT fk_space_time_locks_space
        FOREIGN KEY (space_id) REFERENCES spaces(space_id)
        ON UPDATE CASCADE
        ON DELETE RESTRICT,

    CONSTRAINT fk_space_time_locks_reservation
        FOREIGN KEY (reservation_id) REFERENCES reservations(reservation_id)
        ON UPDATE CASCADE
        ON DELETE RESTRICT
) ENGINE=InnoDB COMMENT='时段锁表（热数据冲突控制）';

CREATE INDEX idx_space_time_locks_conflict
    ON space_time_locks(space_id, lock_status, lock_start_time, lock_end_time);

CREATE INDEX idx_space_time_locks_reservation
    ON space_time_locks(reservation_id, lock_status);

-- =========================================================
-- 8. 实际使用表 usage_sessions
-- 说明：
--   1) 预约执行结果实体
--   2) 一条预约最多一条实际使用记录
--   3) 支持临时占座状态
-- =========================================================
CREATE TABLE usage_sessions (
    session_id            BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY COMMENT '使用记录主键',
    reservation_id        BIGINT UNSIGNED NOT NULL COMMENT '预约ID，唯一',
    check_in_time         DATETIME NULL COMMENT '签到时间',
    check_out_time        DATETIME NULL COMMENT '签退时间',
    actual_minutes        INT NOT NULL DEFAULT 0 COMMENT '实际使用分钟数',
    overtime_minutes      INT NOT NULL DEFAULT 0 COMMENT '超时分钟数',

    hold_start_time       DATETIME NULL COMMENT '临时占座开始时间',
    hold_expire_time      DATETIME NULL COMMENT '临时占座失效时间',
    hold_count            INT NOT NULL DEFAULT 0 COMMENT '临时占座次数',
    total_hold_minutes    INT NOT NULL DEFAULT 0 COMMENT '累计临时占座分钟数',

    session_status        ENUM('NOT_STARTED', 'IN_USE', 'TEMP_HOLD', 'ENDED', 'ABNORMAL') NOT NULL DEFAULT 'NOT_STARTED' COMMENT '使用状态',
    operator_user_id      BIGINT UNSIGNED NULL COMMENT '操作人',
    notes                 VARCHAR(255) NULL COMMENT '备注',

    created_at            DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    updated_at            DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',

    CONSTRAINT uq_usage_sessions_reservation UNIQUE (reservation_id),

    CONSTRAINT chk_usage_sessions_actual_minutes CHECK (actual_minutes >= 0),
    CONSTRAINT chk_usage_sessions_overtime_minutes CHECK (overtime_minutes >= 0),
    CONSTRAINT chk_usage_sessions_hold_count CHECK (hold_count >= 0),
    CONSTRAINT chk_usage_sessions_total_hold_minutes CHECK (total_hold_minutes >= 0),
    CONSTRAINT chk_usage_sessions_checkout CHECK (
        check_out_time IS NULL
        OR check_in_time IS NULL
        OR check_out_time >= check_in_time
    ),
    CONSTRAINT chk_usage_sessions_hold_expire CHECK (
        hold_expire_time IS NULL
        OR hold_start_time IS NULL
        OR hold_expire_time >= hold_start_time
    ),

    CONSTRAINT fk_usage_sessions_reservation
        FOREIGN KEY (reservation_id) REFERENCES reservations(reservation_id)
        ON UPDATE CASCADE
        ON DELETE RESTRICT,

    CONSTRAINT fk_usage_sessions_operator
        FOREIGN KEY (operator_user_id) REFERENCES users(user_id)
        ON UPDATE CASCADE
        ON DELETE SET NULL
) ENGINE=InnoDB COMMENT='实际使用记录表';

CREATE INDEX idx_usage_sessions_status
    ON usage_sessions(session_status, updated_at);

CREATE INDEX idx_usage_sessions_operator
    ON usage_sessions(operator_user_id);

-- =========================================================
-- 9. 账单表 billing_orders
-- 说明：
--   1) 一条预约最多一张账单
--   2) 与预约形成1:1业务依赖
-- =========================================================
CREATE TABLE billing_orders (
    bill_id               BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY COMMENT '账单主键',
    bill_no               VARCHAR(40) NOT NULL COMMENT '账单编号',
    reservation_id        BIGINT UNSIGNED NOT NULL COMMENT '预约ID，唯一',
    user_id               BIGINT UNSIGNED NOT NULL COMMENT '所属用户',
    bill_status           ENUM('UNPAID', 'PAID', 'WAIVED', 'CANCELLED') NOT NULL DEFAULT 'UNPAID' COMMENT '账单状态',

    base_amount           DECIMAL(10,2) NOT NULL DEFAULT 0.00 COMMENT '基础费用',
    overtime_amount       DECIMAL(10,2) NOT NULL DEFAULT 0.00 COMMENT '超时费用',
    discount_amount       DECIMAL(10,2) NOT NULL DEFAULT 0.00 COMMENT '优惠金额',
    payable_amount        DECIMAL(10,2) NOT NULL DEFAULT 0.00 COMMENT '应付金额',
    paid_amount           DECIMAL(10,2) NOT NULL DEFAULT 0.00 COMMENT '实付金额',

    settled_at            DATETIME NULL COMMENT '结算时间',
    remarks               VARCHAR(255) NULL COMMENT '备注',

    created_at            DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    updated_at            DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',

    CONSTRAINT uq_billing_orders_bill_no UNIQUE (bill_no),
    CONSTRAINT uq_billing_orders_reservation UNIQUE (reservation_id),

    CONSTRAINT chk_billing_orders_base_amount CHECK (base_amount >= 0),
    CONSTRAINT chk_billing_orders_overtime_amount CHECK (overtime_amount >= 0),
    CONSTRAINT chk_billing_orders_discount_amount CHECK (discount_amount >= 0),
    CONSTRAINT chk_billing_orders_payable_amount CHECK (payable_amount >= 0),
    CONSTRAINT chk_billing_orders_paid_amount CHECK (paid_amount >= 0),

    CONSTRAINT fk_billing_orders_reservation
        FOREIGN KEY (reservation_id) REFERENCES reservations(reservation_id)
        ON UPDATE CASCADE
        ON DELETE RESTRICT,

    CONSTRAINT fk_billing_orders_user
        FOREIGN KEY (user_id) REFERENCES users(user_id)
        ON UPDATE CASCADE
        ON DELETE RESTRICT
) ENGINE=InnoDB COMMENT='账单表';

CREATE INDEX idx_billing_orders_user_status
    ON billing_orders(user_id, bill_status, settled_at);

-- =========================================================
-- 10. 空间运行状态表 space_runtime_status
-- 说明：
--   1) 与 spaces 共享主键的一对一依赖实体
--   2) 专门表达“当前运行态”，避免和 spaces.status 混用
-- =========================================================
CREATE TABLE space_runtime_status (
    space_id                BIGINT UNSIGNED PRIMARY KEY COMMENT '空间ID，同时也是运行状态ID',
    current_status          ENUM('IDLE', 'RESERVED', 'IN_USE', 'TEMP_HOLD', 'MAINTENANCE') NOT NULL DEFAULT 'IDLE' COMMENT '当前运行状态',
    current_reservation_id  BIGINT UNSIGNED NULL COMMENT '当前关联预约ID',
    current_session_id      BIGINT UNSIGNED NULL COMMENT '当前关联使用记录ID',
    status_since            DATETIME NULL COMMENT '当前状态开始时间',
    hold_expire_time        DATETIME NULL COMMENT '临时占座失效时间',

    created_at              DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    updated_at              DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',

    CONSTRAINT uq_space_runtime_status_reservation UNIQUE (current_reservation_id),
    CONSTRAINT uq_space_runtime_status_session UNIQUE (current_session_id),

    CONSTRAINT fk_space_runtime_status_space
        FOREIGN KEY (space_id) REFERENCES spaces(space_id)
        ON UPDATE CASCADE
        ON DELETE RESTRICT,

    CONSTRAINT fk_space_runtime_status_reservation
        FOREIGN KEY (current_reservation_id) REFERENCES reservations(reservation_id)
        ON UPDATE CASCADE
        ON DELETE SET NULL,

    CONSTRAINT fk_space_runtime_status_session
        FOREIGN KEY (current_session_id) REFERENCES usage_sessions(session_id)
        ON UPDATE CASCADE
        ON DELETE SET NULL
) ENGINE=InnoDB COMMENT='空间运行状态表（共享主键1:1）';

CREATE INDEX idx_space_runtime_status_status
    ON space_runtime_status(current_status, updated_at);

-- =========================================================
-- 11. 账户流水表 account_transactions
-- 说明：
--   1) 审计流水表，不做软删除
--   2) 记录充值、消费、退款、调整等账户变动
-- =========================================================
CREATE TABLE account_transactions (
    txn_id                BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY COMMENT '流水主键',
    txn_no                VARCHAR(40) NOT NULL COMMENT '流水编号',
    account_user_id       BIGINT UNSIGNED NOT NULL COMMENT '账户所属用户ID',
    reservation_id        BIGINT UNSIGNED NULL COMMENT '关联预约ID',
    bill_id               BIGINT UNSIGNED NULL COMMENT '关联账单ID',
    txn_type              ENUM('RECHARGE', 'CONSUME', 'REFUND', 'ADJUST') NOT NULL COMMENT '流水类型',
    direction             ENUM('IN', 'OUT') NOT NULL COMMENT '资金方向',
    amount                DECIMAL(12,2) NOT NULL COMMENT '本次变动金额',
    before_balance        DECIMAL(12,2) NOT NULL COMMENT '变动前余额',
    after_balance         DECIMAL(12,2) NOT NULL COMMENT '变动后余额',
    operator_user_id      BIGINT UNSIGNED NULL COMMENT '操作人',
    remark                VARCHAR(255) NULL COMMENT '备注',

    created_at            DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',

    CONSTRAINT uq_account_transactions_no UNIQUE (txn_no),

    CONSTRAINT chk_account_transactions_amount CHECK (amount > 0),
    CONSTRAINT chk_account_transactions_before_balance CHECK (before_balance >= 0),
    CONSTRAINT chk_account_transactions_after_balance CHECK (after_balance >= 0),

    CONSTRAINT fk_account_transactions_account
        FOREIGN KEY (account_user_id) REFERENCES user_accounts(user_id)
        ON UPDATE CASCADE
        ON DELETE RESTRICT,

    CONSTRAINT fk_account_transactions_reservation
        FOREIGN KEY (reservation_id) REFERENCES reservations(reservation_id)
        ON UPDATE CASCADE
        ON DELETE RESTRICT,

    CONSTRAINT fk_account_transactions_bill
        FOREIGN KEY (bill_id) REFERENCES billing_orders(bill_id)
        ON UPDATE CASCADE
        ON DELETE RESTRICT,

    CONSTRAINT fk_account_transactions_operator
        FOREIGN KEY (operator_user_id) REFERENCES users(user_id)
        ON UPDATE CASCADE
        ON DELETE SET NULL
) ENGINE=InnoDB COMMENT='账户流水表';

CREATE INDEX idx_account_transactions_account_time
    ON account_transactions(account_user_id, created_at);

CREATE INDEX idx_account_transactions_bill
    ON account_transactions(bill_id);

-- =========================================================
-- 12. 信用分流水表 credit_transactions
-- 说明：
--   1) 审计信用分变化
--   2) 解决“只看得见当前信用分，看不见扣分原因”的问题
-- =========================================================
CREATE TABLE credit_transactions (
    credit_txn_id         BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY COMMENT '信用流水主键',
    user_id               BIGINT UNSIGNED NOT NULL COMMENT '用户ID',
    reservation_id        BIGINT UNSIGNED NULL COMMENT '关联预约ID',
    session_id            BIGINT UNSIGNED NULL COMMENT '关联使用记录ID',
    event_type            ENUM('NO_SHOW', 'OVERTIME', 'HOLD_TIMEOUT', 'MANUAL_ADJUST', 'MANUAL_RESTORE') NOT NULL COMMENT '事件类型',
    change_score          INT NOT NULL COMMENT '信用分变化值，正数加分，负数扣分',
    before_score          INT NOT NULL COMMENT '变化前信用分',
    after_score           INT NOT NULL COMMENT '变化后信用分',
    operator_user_id      BIGINT UNSIGNED NULL COMMENT '操作人',
    reason_text           VARCHAR(255) NULL COMMENT '原因描述',

    created_at            DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',

    CONSTRAINT chk_credit_transactions_change_score CHECK (change_score <> 0),
    CONSTRAINT chk_credit_transactions_before_score CHECK (before_score BETWEEN 0 AND 1000),
    CONSTRAINT chk_credit_transactions_after_score CHECK (after_score BETWEEN 0 AND 1000),

    CONSTRAINT fk_credit_transactions_user
        FOREIGN KEY (user_id) REFERENCES users(user_id)
        ON UPDATE CASCADE
        ON DELETE RESTRICT,

    CONSTRAINT fk_credit_transactions_reservation
        FOREIGN KEY (reservation_id) REFERENCES reservations(reservation_id)
        ON UPDATE CASCADE
        ON DELETE RESTRICT,

    CONSTRAINT fk_credit_transactions_session
        FOREIGN KEY (session_id) REFERENCES usage_sessions(session_id)
        ON UPDATE CASCADE
        ON DELETE RESTRICT,

    CONSTRAINT fk_credit_transactions_operator
        FOREIGN KEY (operator_user_id) REFERENCES users(user_id)
        ON UPDATE CASCADE
        ON DELETE SET NULL
) ENGINE=InnoDB COMMENT='信用分流水表';

CREATE INDEX idx_credit_transactions_user_time
    ON credit_transactions(user_id, created_at);

CREATE INDEX idx_credit_transactions_reservation
    ON credit_transactions(reservation_id);

-- =========================================================
-- 视图：解决软删除查询污染
-- =========================================================

-- 未逻辑删除用户
CREATE OR REPLACE VIEW v_active_users AS
SELECT
    u.user_id,
    u.user_no,
    u.real_name,
    u.phone,
    u.email,
    u.user_type,
    u.account_status,
    u.credit_score,
    u.last_login_time,
    u.created_at,
    u.updated_at
FROM users u
WHERE u.is_deleted = 0;

-- 未逻辑删除场地
CREATE OR REPLACE VIEW v_active_locations AS
SELECT
    l.location_id,
    l.parent_location_id,
    l.location_code,
    l.location_name,
    l.location_type,
    l.floor_no,
    l.room_no,
    l.open_time,
    l.close_time,
    l.status,
    l.remarks,
    l.created_at,
    l.updated_at
FROM locations l
WHERE l.is_deleted = 0;

-- 未逻辑删除且启用的计费策略
CREATE OR REPLACE VIEW v_active_pricing_policies AS
SELECT
    p.policy_id,
    p.policy_code,
    p.policy_name,
    p.charge_mode,
    p.hourly_price,
    p.free_minutes,
    p.max_reserve_hours,
    p.deposit_amount,
    p.overtime_price_multiplier,
    p.allow_temp_hold,
    p.temp_hold_limit_minutes,
    p.temp_hold_max_count,
    p.is_active,
    p.valid_from,
    p.valid_to,
    p.remarks,
    p.created_at,
    p.updated_at
FROM pricing_policies p
WHERE p.is_deleted = 0
  AND p.is_active = 1;

-- 可用空间视图：只展示未逻辑删除且静态有效的空间
CREATE OR REPLACE VIEW v_active_spaces AS
SELECT
    s.space_id,
    s.location_id,
    l.location_name,
    s.policy_id,
    p.policy_name,
    p.charge_mode,
    s.space_code,
    s.space_name,
    s.space_type,
    s.capacity,
    s.equipment_desc,
    s.status,
    s.sort_no,
    s.created_at,
    s.updated_at
FROM spaces s
JOIN locations l
  ON s.location_id = l.location_id
JOIN pricing_policies p
  ON s.policy_id = p.policy_id
WHERE s.is_deleted = 0
  AND l.is_deleted = 0
  AND p.is_deleted = 0
  AND s.status = 'ACTIVE'
  AND l.status = 'ACTIVE'
  AND p.is_active = 1;

ALTER TABLE users
    ADD COLUMN IF NOT EXISTS password_hash VARCHAR(100) NOT NULL DEFAULT '';

SET FOREIGN_KEY_CHECKS = 1;
