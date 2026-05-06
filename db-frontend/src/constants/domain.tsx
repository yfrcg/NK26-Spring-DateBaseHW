import {
  BankOutlined,
  CoffeeOutlined,
  DesktopOutlined,
  ExperimentOutlined,
  HomeOutlined,
  ReadOutlined,
  TeamOutlined,
} from '@ant-design/icons';

export const userTypeMap: Record<string, string> = {
  STUDENT: '学生',
  TEACHER: '教师',
  ADMIN: '管理员',
};

export const registerUserTypeOptions = [
  { label: '学生', value: 'STUDENT' },
  { label: '教师', value: 'TEACHER' },
];

export const accountStatusMap: Record<string, string> = {
  ACTIVE: '正常',
  SUSPENDED: '停用',
  ARREARS_LOCKED: '欠费锁定',
};

export const accountStatusColorMap: Record<string, string> = {
  ACTIVE: 'success',
  SUSPENDED: 'error',
  ARREARS_LOCKED: 'warning',
};

export const spaceStatusMap: Record<string, string> = {
  ACTIVE: '可用',
  DISABLED: '停用',
  MAINTENANCE: '维护中',
};

export const spaceStatusColorMap: Record<string, string> = {
  ACTIVE: 'green',
  DISABLED: 'red',
  MAINTENANCE: 'orange',
};

export const runtimeStatusMap: Record<string, string> = {
  IDLE: '空闲',
  IN_USE: '使用中',
  TEMP_HOLD: '暂离中',
};

export const runtimeStatusColorMap: Record<string, string> = {
  IDLE: 'green',
  IN_USE: 'blue',
  TEMP_HOLD: 'gold',
};

export const reservationStatusMap: Record<string, string> = {
  CONFIRMED: '待签到',
  IN_USE: '使用中',
  FINISHED: '已完成',
  CANCELLED: '已取消',
  NO_SHOW: '未签到',
};

export const reservationStatusColorMap: Record<string, string> = {
  CONFIRMED: 'processing',
  IN_USE: 'cyan',
  FINISHED: 'success',
  CANCELLED: 'default',
  NO_SHOW: 'error',
};

export const sessionStatusMap: Record<string, string> = {
  NOT_STARTED: '未开始',
  IN_USE: '使用中',
  TEMP_HOLD: '暂离中',
  ENDED: '已签退',
  ABNORMAL: '异常结束',
};

export const sessionStatusColorMap: Record<string, string> = {
  NOT_STARTED: 'default',
  IN_USE: 'processing',
  TEMP_HOLD: 'warning',
  ENDED: 'success',
  ABNORMAL: 'error',
};

export const billStatusMap: Record<string, string> = {
  PAID: '已支付',
  UNPAID: '未支付',
};

export const chargeModeMap: Record<string, string> = {
  FREE: '免费',
  PAID: '按时计费',
};

export const creditEventMap: Record<string, string> = {
  MANUAL_ADJUST: '手动调整',
  MANUAL_RESTORE: '手动恢复',
  NO_SHOW: '预约未到',
  OVERTIME: '超时扣分',
  HOLD_TIMEOUT: '暂离超时',
};

export const creditEventColorMap: Record<string, string> = {
  MANUAL_ADJUST: 'purple',
  MANUAL_RESTORE: 'green',
  NO_SHOW: 'red',
  OVERTIME: 'volcano',
  HOLD_TIMEOUT: 'orange',
};

export const txnTypeMap: Record<string, string> = {
  RECHARGE: '充值',
  CONSUME: '消费',
  REFUND: '退款',
  ADJUST: '调整',
};

export const txnDirectionMap: Record<string, string> = {
  IN: '收入',
  OUT: '支出',
};

export const spaceTypeMap: Record<string, string> = {
  SEAT: '座位',
  DESK: '工位',
  ROOM: '房间',
  OFFICE: '办公室',
  STUDY_ROOM: '自习室',
  MEETING_ROOM: '会议室',
  LAB: '实验室',
  READING_ROOM: '阅览区',
  OTHER: '其他',
};

export const spaceTypeIcon: Record<string, React.ReactNode> = {
  SEAT: <DesktopOutlined />,
  DESK: <DesktopOutlined />,
  ROOM: <HomeOutlined />,
  OFFICE: <BankOutlined />,
  STUDY_ROOM: <ReadOutlined />,
  MEETING_ROOM: <TeamOutlined />,
  LAB: <ExperimentOutlined />,
  READING_ROOM: <ReadOutlined />,
  OTHER: <CoffeeOutlined />,
};
