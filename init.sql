-- =========================================================
-- 共享空间预约管理系统：精简版建库脚本
-- 9表 + 3视图，适合数据库期末设计作业
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
-- 单表继承：STUDENT / TEACHER / ADMIN
-- 同时合并原 user_accounts 中的账户字段
-- =========================================================
CREATE TABLE users (
    user_id          BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY COMMENT '用户主键',
    user_no          VARCHAR(32) NOT NULL COMMENT '学号/工号/用户编号',
    real_name        VARCHAR(50) NOT NULL COMMENT '真实姓名',
    password_hash    VARCHAR(100) NOT NULL DEFAULT '' COMMENT '密码哈希',
    phone            VARCHAR(20) NULL COMMENT '手机号',
    email            VARCHAR(100) NULL COMMENT '邮箱',
    user_type        ENUM('STUDENT', 'TEACHER', 'ADMIN') NOT NULL DEFAULT 'STUDENT' COMMENT '用户类型',
    account_status   ENUM('ACTIVE', 'SUSPENDED', 'ARREARS_LOCKED') NOT NULL DEFAULT 'ACTIVE' COMMENT '账号状态',

    balance          DECIMAL(12,2) NOT NULL DEFAULT 0.00 COMMENT '账户余额',
    arrears_amount   DECIMAL(12,2) NOT NULL DEFAULT 0.00 COMMENT '欠费金额',
    total_recharge   DECIMAL(12,2) NOT NULL DEFAULT 0.00 COMMENT '累计充值',
    total_spend      DECIMAL(12,2) NOT NULL DEFAULT 0.00 COMMENT '累计消费',
    credit_score     INT NOT NULL DEFAULT 100 COMMENT '信用分',

    last_login_time  DATETIME NULL COMMENT '最近登录时间',
    created_at       DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    updated_at       DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
    is_deleted       TINYINT(1) NOT NULL DEFAULT 0 COMMENT '是否逻辑删除',
    deleted_at       DATETIME NULL COMMENT '逻辑删除时间',
    deleted_by       BIGINT UNSIGNED NULL COMMENT '逻辑删除操作人',

    CONSTRAINT uq_users_user_no UNIQUE (user_no),
    CONSTRAINT uq_users_phone UNIQUE (phone),
    CONSTRAINT uq_users_email UNIQUE (email),

    CONSTRAINT chk_users_balance CHECK (balance >= 0),
    CONSTRAINT chk_users_arrears CHECK (arrears_amount >= 0),
    CONSTRAINT chk_users_total_recharge CHECK (total_recharge >= 0),
    CONSTRAINT chk_users_total_spend CHECK (total_spend >= 0),
    CONSTRAINT chk_users_credit_score CHECK (credit_score BETWEEN 0 AND 1000),
    CONSTRAINT chk_users_is_deleted CHECK (is_deleted IN (0, 1)),

    CONSTRAINT fk_users_deleted_by
        FOREIGN KEY (deleted_by) REFERENCES users(user_id)
        ON UPDATE CASCADE
        ON DELETE SET NULL
) ENGINE=InnoDB COMMENT='用户表';

CREATE INDEX idx_users_type_status ON users(user_type, account_status);
CREATE INDEX idx_users_deleted_status ON users(is_deleted, account_status);

-- =========================================================
-- 2. 场地表 locations
-- 自引用：BUILDING / ZONE / ROOM
-- =========================================================
CREATE TABLE locations (
    location_id        BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY COMMENT '场地主键',
    parent_location_id BIGINT UNSIGNED NULL COMMENT '父场地ID',
    location_code      VARCHAR(30) NOT NULL COMMENT '场地编码',
    location_name      VARCHAR(100) NOT NULL COMMENT '场地名称',
    location_type      ENUM('BUILDING', 'ZONE', 'ROOM') NOT NULL COMMENT '场地类型',
    floor_no           VARCHAR(10) NULL COMMENT '楼层号',
    room_no            VARCHAR(20) NULL COMMENT '房间号',
    open_time          TIME NOT NULL DEFAULT '08:00:00' COMMENT '开放时间',
    close_time         TIME NOT NULL DEFAULT '22:00:00' COMMENT '关闭时间',
    status             ENUM('ACTIVE', 'INACTIVE') NOT NULL DEFAULT 'ACTIVE' COMMENT '场地状态',
    remarks            VARCHAR(255) NULL COMMENT '备注',

    created_at         DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at         DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    is_deleted         TINYINT(1) NOT NULL DEFAULT 0,
    deleted_at         DATETIME NULL,
    deleted_by         BIGINT UNSIGNED NULL,

    CONSTRAINT uq_locations_code UNIQUE (location_code),
    CONSTRAINT chk_locations_time CHECK (close_time > open_time),
    CONSTRAINT chk_locations_is_deleted CHECK (is_deleted IN (0, 1)),

    CONSTRAINT fk_locations_parent
        FOREIGN KEY (parent_location_id) REFERENCES locations(location_id)
        ON UPDATE CASCADE
        ON DELETE RESTRICT,

    CONSTRAINT fk_locations_deleted_by
        FOREIGN KEY (deleted_by) REFERENCES users(user_id)
        ON UPDATE CASCADE
        ON DELETE SET NULL
) ENGINE=InnoDB COMMENT='场地表';

CREATE INDEX idx_locations_parent ON locations(parent_location_id);
CREATE INDEX idx_locations_type_status ON locations(location_type, status);

-- =========================================================
-- 3. 计费策略表 pricing_policies
-- 单表继承：FREE / PAID
-- =========================================================
CREATE TABLE pricing_policies (
    policy_id                  BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY COMMENT '策略主键',
    policy_code                VARCHAR(30) NOT NULL COMMENT '策略编码',
    policy_name                VARCHAR(100) NOT NULL COMMENT '策略名称',
    charge_mode                ENUM('FREE', 'PAID') NOT NULL COMMENT '计费模式',
    hourly_price               DECIMAL(10,2) NOT NULL DEFAULT 0.00 COMMENT '小时单价',
    free_minutes               INT NOT NULL DEFAULT 0 COMMENT '免费分钟数',
    max_reserve_hours          INT NOT NULL DEFAULT 4 COMMENT '最大预约时长',
    overtime_price_multiplier  DECIMAL(5,2) NOT NULL DEFAULT 1.50 COMMENT '超时倍率',
    allow_temp_hold            TINYINT(1) NOT NULL DEFAULT 0 COMMENT '是否允许临时占座',
    temp_hold_limit_minutes    INT NOT NULL DEFAULT 0 COMMENT '临时占座分钟数',
    temp_hold_max_count        INT NOT NULL DEFAULT 0 COMMENT '临时占座次数上限',
    is_active                  TINYINT(1) NOT NULL DEFAULT 1 COMMENT '是否启用',
    valid_from                 DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '生效时间',
    valid_to                   DATETIME NULL COMMENT '失效时间',
    remarks                    VARCHAR(255) NULL COMMENT '备注',

    created_at                 DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at                 DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    is_deleted                 TINYINT(1) NOT NULL DEFAULT 0,
    deleted_at                 DATETIME NULL,
    deleted_by                 BIGINT UNSIGNED NULL,

    CONSTRAINT uq_pricing_code UNIQUE (policy_code),
    CONSTRAINT uq_pricing_name UNIQUE (policy_name),

    CONSTRAINT chk_pricing_hourly_price CHECK (hourly_price >= 0),
    CONSTRAINT chk_pricing_free_minutes CHECK (free_minutes >= 0),
    CONSTRAINT chk_pricing_max_hours CHECK (max_reserve_hours > 0),
    CONSTRAINT chk_pricing_overtime CHECK (overtime_price_multiplier >= 1.00),
    CONSTRAINT chk_pricing_active CHECK (is_active IN (0, 1)),
    CONSTRAINT chk_pricing_deleted CHECK (is_deleted IN (0, 1)),
    CONSTRAINT chk_pricing_valid CHECK (valid_to IS NULL OR valid_to > valid_from),

    CONSTRAINT chk_pricing_mode_price CHECK (
        (charge_mode = 'FREE' AND hourly_price = 0.00)
        OR
        (charge_mode = 'PAID' AND hourly_price >= 0.00)
    ),

    CONSTRAINT chk_pricing_temp_hold CHECK (
        (allow_temp_hold = 0 AND temp_hold_limit_minutes = 0 AND temp_hold_max_count = 0)
        OR
        (allow_temp_hold = 1 AND temp_hold_limit_minutes > 0 AND temp_hold_max_count > 0)
    ),

    CONSTRAINT fk_pricing_deleted_by
        FOREIGN KEY (deleted_by) REFERENCES users(user_id)
        ON UPDATE CASCADE
        ON DELETE SET NULL
) ENGINE=InnoDB COMMENT='计费策略表';

CREATE INDEX idx_pricing_mode_active ON pricing_policies(charge_mode, is_active);

-- =========================================================
-- 4. 空间表 spaces
-- 单表继承：SEAT / DESK / ROOM / OFFICE
-- =========================================================
CREATE TABLE spaces (
    space_id        BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY COMMENT '空间主键',
    location_id     BIGINT UNSIGNED NOT NULL COMMENT '所属场地',
    policy_id       BIGINT UNSIGNED NOT NULL COMMENT '计费策略',
    space_code      VARCHAR(30) NOT NULL COMMENT '空间编码',
    space_name      VARCHAR(100) NOT NULL COMMENT '空间名称',
    space_type      ENUM('SEAT', 'DESK', 'ROOM', 'OFFICE') NOT NULL COMMENT '空间类型',
    capacity        INT NOT NULL DEFAULT 1 COMMENT '容量',
    equipment_desc  VARCHAR(255) NULL COMMENT '设备说明',
    status          ENUM('ACTIVE', 'MAINTENANCE', 'DISABLED') NOT NULL DEFAULT 'ACTIVE' COMMENT '状态',
    sort_no         INT NOT NULL DEFAULT 0 COMMENT '排序号',

    created_at      DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at      DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    is_deleted      TINYINT(1) NOT NULL DEFAULT 0,
    deleted_at      DATETIME NULL,
    deleted_by      BIGINT UNSIGNED NULL,

    CONSTRAINT uq_spaces_location_code UNIQUE (location_id, space_code),
    CONSTRAINT chk_spaces_capacity CHECK (capacity > 0),
    CONSTRAINT chk_spaces_deleted CHECK (is_deleted IN (0, 1)),
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
) ENGINE=InnoDB COMMENT='空间表';

CREATE INDEX idx_spaces_location_status ON spaces(location_id, status);
CREATE INDEX idx_spaces_policy_status ON spaces(policy_id, status);

-- =========================================================
-- 5. 预约表 reservations
-- Users 与 Spaces 的 M:N 关系实体化
-- =========================================================
CREATE TABLE reservations (
    reservation_id               BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY COMMENT '预约主键',
    reservation_no               VARCHAR(40) NOT NULL COMMENT '预约编号',
    user_id                      BIGINT UNSIGNED NOT NULL COMMENT '预约用户',
    space_id                     BIGINT UNSIGNED NOT NULL COMMENT '预约空间',
    policy_id                    BIGINT UNSIGNED NOT NULL COMMENT '策略ID',
    reservation_type             ENUM('ONLINE', 'ADMIN') NOT NULL DEFAULT 'ONLINE',
    start_time                   DATETIME NOT NULL COMMENT '开始时间',
    end_time                     DATETIME NOT NULL COMMENT '结束时间',
    reservation_status           ENUM('PENDING', 'CONFIRMED', 'CANCELLED', 'IN_USE', 'FINISHED', 'NO_SHOW') NOT NULL DEFAULT 'CONFIRMED',

    charge_mode_snapshot         ENUM('FREE', 'PAID') NOT NULL,
    hourly_price_snapshot        DECIMAL(10,2) NOT NULL DEFAULT 0.00,
    free_minutes_snapshot        INT NOT NULL DEFAULT 0,
    max_reserve_hours_snapshot   INT NOT NULL,
    overtime_multiplier_snapshot DECIMAL(5,2) NOT NULL DEFAULT 1.50,
    amount_estimated             DECIMAL(10,2) NOT NULL DEFAULT 0.00,

    cancel_reason                VARCHAR(255) NULL,
    cancel_time                  DATETIME NULL,
    created_at                   DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at                   DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    CONSTRAINT uq_reservations_no UNIQUE (reservation_no),
    CONSTRAINT chk_reservations_time CHECK (end_time > start_time),
    CONSTRAINT chk_reservations_amount CHECK (amount_estimated >= 0),
    CONSTRAINT chk_reservations_price CHECK (hourly_price_snapshot >= 0),
    CONSTRAINT chk_reservations_max_hours CHECK (max_reserve_hours_snapshot > 0),
    CONSTRAINT chk_reservations_overtime CHECK (overtime_multiplier_snapshot >= 1.00),

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
) ENGINE=InnoDB COMMENT='预约表';

CREATE INDEX idx_reservations_user_status ON reservations(user_id, reservation_status, created_at);
CREATE INDEX idx_reservations_space_time ON reservations(space_id, reservation_status, start_time, end_time);

-- =========================================================
-- 6. 时段锁表 space_time_locks
-- 用于防止同一空间同一时间段重复预约
-- =========================================================
CREATE TABLE space_time_locks (
    lock_id         BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY COMMENT '锁主键',
    space_id        BIGINT UNSIGNED NOT NULL COMMENT '空间ID',
    reservation_id  BIGINT UNSIGNED NOT NULL COMMENT '预约ID',
    lock_type       ENUM('RESERVATION', 'TEMP_HOLD') NOT NULL DEFAULT 'RESERVATION',
    lock_start_time DATETIME NOT NULL COMMENT '锁开始时间',
    lock_end_time   DATETIME NOT NULL COMMENT '锁结束时间',
    lock_status     ENUM('ACTIVE', 'RELEASED', 'EXPIRED') NOT NULL DEFAULT 'ACTIVE',
    created_at      DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at      DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    CONSTRAINT chk_locks_time CHECK (lock_end_time > lock_start_time),

    CONSTRAINT fk_locks_space
        FOREIGN KEY (space_id) REFERENCES spaces(space_id)
        ON UPDATE CASCADE
        ON DELETE RESTRICT,

    CONSTRAINT fk_locks_reservation
        FOREIGN KEY (reservation_id) REFERENCES reservations(reservation_id)
        ON UPDATE CASCADE
        ON DELETE RESTRICT
) ENGINE=InnoDB COMMENT='时段锁表';

CREATE INDEX idx_locks_conflict ON space_time_locks(space_id, lock_status, lock_start_time, lock_end_time);
CREATE INDEX idx_locks_reservation ON space_time_locks(reservation_id, lock_status);

-- =========================================================
-- 7. 使用会话表 usage_sessions
-- =========================================================
CREATE TABLE usage_sessions (
    session_id          BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY COMMENT '使用记录主键',
    reservation_id      BIGINT UNSIGNED NOT NULL COMMENT '预约ID',
    check_in_time       DATETIME NULL COMMENT '签到时间',
    check_out_time      DATETIME NULL COMMENT '签退时间',
    actual_minutes      INT NOT NULL DEFAULT 0 COMMENT '实际使用分钟数',
    overtime_minutes    INT NOT NULL DEFAULT 0 COMMENT '超时分钟数',
    hold_start_time     DATETIME NULL COMMENT '临时占座开始',
    hold_expire_time    DATETIME NULL COMMENT '临时占座结束',
    hold_count          INT NOT NULL DEFAULT 0 COMMENT '临时占座次数',
    session_status      ENUM('NOT_STARTED', 'IN_USE', 'TEMP_HOLD', 'ENDED', 'ABNORMAL') NOT NULL DEFAULT 'NOT_STARTED',
    operator_user_id    BIGINT UNSIGNED NULL COMMENT '操作人',
    notes               VARCHAR(255) NULL COMMENT '备注',
    created_at          DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at          DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    CONSTRAINT uq_usage_reservation UNIQUE (reservation_id),
    CONSTRAINT chk_usage_actual CHECK (actual_minutes >= 0),
    CONSTRAINT chk_usage_overtime CHECK (overtime_minutes >= 0),
    CONSTRAINT chk_usage_hold_count CHECK (hold_count >= 0),
    CONSTRAINT chk_usage_checkout CHECK (
        check_out_time IS NULL
        OR check_in_time IS NULL
        OR check_out_time >= check_in_time
    ),

    CONSTRAINT fk_usage_reservation
        FOREIGN KEY (reservation_id) REFERENCES reservations(reservation_id)
        ON UPDATE CASCADE
        ON DELETE RESTRICT,

    CONSTRAINT fk_usage_operator
        FOREIGN KEY (operator_user_id) REFERENCES users(user_id)
        ON UPDATE CASCADE
        ON DELETE SET NULL
) ENGINE=InnoDB COMMENT='使用会话表';

CREATE INDEX idx_usage_status ON usage_sessions(session_status, updated_at);

-- =========================================================
-- 8. 账单表 billing_orders
-- =========================================================
CREATE TABLE billing_orders (
    bill_id         BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY COMMENT '账单主键',
    bill_no         VARCHAR(40) NOT NULL COMMENT '账单编号',
    reservation_id  BIGINT UNSIGNED NOT NULL COMMENT '预约ID',
    user_id         BIGINT UNSIGNED NOT NULL COMMENT '用户ID',
    bill_status     ENUM('UNPAID', 'PAID', 'WAIVED', 'CANCELLED') NOT NULL DEFAULT 'UNPAID',
    base_amount     DECIMAL(10,2) NOT NULL DEFAULT 0.00,
    overtime_amount DECIMAL(10,2) NOT NULL DEFAULT 0.00,
    discount_amount DECIMAL(10,2) NOT NULL DEFAULT 0.00,
    payable_amount  DECIMAL(10,2) NOT NULL DEFAULT 0.00,
    paid_amount     DECIMAL(10,2) NOT NULL DEFAULT 0.00,
    settled_at      DATETIME NULL,
    remarks         VARCHAR(255) NULL,
    created_at      DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at      DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    CONSTRAINT uq_bills_no UNIQUE (bill_no),
    CONSTRAINT uq_bills_reservation UNIQUE (reservation_id),
    CONSTRAINT chk_bills_base CHECK (base_amount >= 0),
    CONSTRAINT chk_bills_overtime CHECK (overtime_amount >= 0),
    CONSTRAINT chk_bills_discount CHECK (discount_amount >= 0),
    CONSTRAINT chk_bills_payable CHECK (payable_amount >= 0),
    CONSTRAINT chk_bills_paid CHECK (paid_amount >= 0),

    CONSTRAINT fk_bills_reservation
        FOREIGN KEY (reservation_id) REFERENCES reservations(reservation_id)
        ON UPDATE CASCADE
        ON DELETE RESTRICT,

    CONSTRAINT fk_bills_user
        FOREIGN KEY (user_id) REFERENCES users(user_id)
        ON UPDATE CASCADE
        ON DELETE RESTRICT
) ENGINE=InnoDB COMMENT='账单表';

CREATE INDEX idx_bills_user_status ON billing_orders(user_id, bill_status, settled_at);

-- =========================================================
-- 9. 用户流水表 user_transactions
-- 合并原账户流水 account_transactions 和信用流水 credit_transactions
-- =========================================================
CREATE TABLE user_transactions (
    txn_id            BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY COMMENT '流水主键',
    txn_no            VARCHAR(40) NOT NULL COMMENT '流水编号',
    user_id           BIGINT UNSIGNED NOT NULL COMMENT '用户ID',
    reservation_id    BIGINT UNSIGNED NULL COMMENT '关联预约',
    bill_id           BIGINT UNSIGNED NULL COMMENT '关联账单',
    session_id        BIGINT UNSIGNED NULL COMMENT '关联使用会话',

    txn_category      ENUM('ACCOUNT', 'CREDIT') NOT NULL COMMENT '流水类别',
    txn_type          ENUM('RECHARGE', 'CONSUME', 'REFUND', 'ADJUST', 'NO_SHOW', 'OVERTIME', 'HOLD_TIMEOUT', 'MANUAL_RESTORE') NOT NULL COMMENT '流水类型',
    direction         ENUM('IN', 'OUT', 'NONE') NOT NULL DEFAULT 'NONE' COMMENT '资金方向',

    amount            DECIMAL(12,2) NULL COMMENT '金额变化',
    before_balance    DECIMAL(12,2) NULL COMMENT '变化前余额',
    after_balance     DECIMAL(12,2) NULL COMMENT '变化后余额',

    credit_delta      INT NULL COMMENT '信用分变化',
    before_score      INT NULL COMMENT '变化前信用分',
    after_score       INT NULL COMMENT '变化后信用分',

    operator_user_id  BIGINT UNSIGNED NULL COMMENT '操作人',
    remark            VARCHAR(255) NULL COMMENT '备注',
    created_at        DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT uq_user_transactions_no UNIQUE (txn_no),

    CONSTRAINT chk_txn_amount CHECK (amount IS NULL OR amount > 0),
    CONSTRAINT chk_txn_before_balance CHECK (before_balance IS NULL OR before_balance >= 0),
    CONSTRAINT chk_txn_after_balance CHECK (after_balance IS NULL OR after_balance >= 0),
    CONSTRAINT chk_txn_before_score CHECK (before_score IS NULL OR before_score BETWEEN 0 AND 1000),
    CONSTRAINT chk_txn_after_score CHECK (after_score IS NULL OR after_score BETWEEN 0 AND 1000),

    CONSTRAINT chk_txn_account_rule CHECK (
        txn_category <> 'ACCOUNT'
        OR
        (amount IS NOT NULL AND before_balance IS NOT NULL AND after_balance IS NOT NULL)
    ),

    CONSTRAINT chk_txn_credit_rule CHECK (
        txn_category <> 'CREDIT'
        OR
        (credit_delta IS NOT NULL AND before_score IS NOT NULL AND after_score IS NOT NULL)
    ),

    CONSTRAINT fk_txn_user
        FOREIGN KEY (user_id) REFERENCES users(user_id)
        ON UPDATE CASCADE
        ON DELETE RESTRICT,

    CONSTRAINT fk_txn_reservation
        FOREIGN KEY (reservation_id) REFERENCES reservations(reservation_id)
        ON UPDATE CASCADE
        ON DELETE RESTRICT,

    CONSTRAINT fk_txn_bill
        FOREIGN KEY (bill_id) REFERENCES billing_orders(bill_id)
        ON UPDATE CASCADE
        ON DELETE RESTRICT,

    CONSTRAINT fk_txn_session
        FOREIGN KEY (session_id) REFERENCES usage_sessions(session_id)
        ON UPDATE CASCADE
        ON DELETE RESTRICT,

    CONSTRAINT fk_txn_operator
        FOREIGN KEY (operator_user_id) REFERENCES users(user_id)
        ON UPDATE CASCADE
        ON DELETE SET NULL
) ENGINE=InnoDB COMMENT='用户账户与信用综合流水表';

CREATE INDEX idx_txn_user_time ON user_transactions(user_id, created_at);
CREATE INDEX idx_txn_category_type ON user_transactions(txn_category, txn_type);

-- =========================================================
-- 视图
-- =========================================================

CREATE OR REPLACE VIEW v_active_users AS
SELECT
    user_id,
    user_no,
    real_name,
    phone,
    email,
    user_type,
    account_status,
    balance,
    arrears_amount,
    credit_score,
    created_at,
    updated_at
FROM users
WHERE is_deleted = 0;

CREATE OR REPLACE VIEW v_active_spaces AS
SELECT
    s.space_id,
    s.space_code,
    s.space_name,
    s.space_type,
    s.capacity,
    s.status,
    l.location_name,
    p.policy_name,
    p.charge_mode,
    p.hourly_price
FROM spaces s
JOIN locations l ON s.location_id = l.location_id
JOIN pricing_policies p ON s.policy_id = p.policy_id
WHERE s.is_deleted = 0
  AND l.is_deleted = 0
  AND p.is_deleted = 0
  AND s.status = 'ACTIVE'
  AND l.status = 'ACTIVE'
  AND p.is_active = 1;

CREATE OR REPLACE VIEW v_reservation_detail AS
SELECT
    r.reservation_id,
    r.reservation_no,
    u.user_no,
    u.real_name,
    s.space_code,
    s.space_name,
    l.location_name,
    r.start_time,
    r.end_time,
    r.reservation_status,
    r.amount_estimated,
    b.bill_status,
    b.payable_amount,
    b.paid_amount
FROM reservations r
JOIN users u ON r.user_id = u.user_id
JOIN spaces s ON r.space_id = s.space_id
JOIN locations l ON s.location_id = l.location_id
LEFT JOIN billing_orders b ON r.reservation_id = b.reservation_id;

SET FOREIGN_KEY_CHECKS = 1;