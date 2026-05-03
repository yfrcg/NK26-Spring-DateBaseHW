export const userTypeMap: Record<string, string> = {
  STUDENT: '学生',
  TEACHER: '教师',
  ADMIN: '管理员',
};

export const registerUserTypeOptions = [
  { label: '学生', value: 'STUDENT' },
  { label: '教师', value: 'TEACHER' },
];

export const accountStatusMap: Record<string, { color: string; text: string }> = {
  ACTIVE: { color: 'green', text: '正常' },
  SUSPENDED: { color: 'red', text: '停用' },
  ARREARS_LOCKED: { color: 'orange', text: '欠费锁定' },
};

export const spaceStatusMap: Record<string, { color: string; text: string }> = {
  ACTIVE: { color: 'green', text: '可用' },
  DISABLED: { color: 'red', text: '停用' },
  MAINTENANCE: { color: 'orange', text: '维护中' },
};

export const runtimeStatusMap: Record<string, { color: string; text: string }> = {
  IDLE: { color: 'green', text: '空闲' },
  IN_USE: { color: 'blue', text: '使用中' },
  TEMP_HOLD: { color: 'gold', text: '暂离中' },
};

export const reservationStatusMap: Record<string, { color: string; text: string }> = {
  CONFIRMED: { color: 'blue', text: '待签到' },
  IN_USE: { color: 'green', text: '使用中' },
  FINISHED: { color: 'default', text: '已完成' },
  CANCELLED: { color: 'red', text: '已取消' },
  NO_SHOW: { color: 'volcano', text: '未签到' },
};

export const sessionStatusMap: Record<string, { color: string; text: string }> = {
  NOT_STARTED: { color: 'default', text: '未开始' },
  IN_USE: { color: 'green', text: '使用中' },
  TEMP_HOLD: { color: 'gold', text: '暂离中' },
  ENDED: { color: 'default', text: '已签退' },
  ABNORMAL: { color: 'volcano', text: '异常结束' },
};

export const billStatusMap: Record<string, { color: string; text: string }> = {
  PAID: { color: 'green', text: '已支付' },
  UNPAID: { color: 'red', text: '未支付' },
};

export const chargeModeMap: Record<string, string> = {
  FREE: '免费',
  PAID: '按时计费',
};

export const creditEventMap: Record<string, { color: string; text: string }> = {
  MANUAL_ADJUST: { color: 'purple', text: '手动调整' },
  MANUAL_RESTORE: { color: 'green', text: '手动恢复' },
  NO_SHOW: { color: 'red', text: '预约未到' },
  OVERTIME: { color: 'volcano', text: '超时扣分' },
  HOLD_TIMEOUT: { color: 'orange', text: '暂离超时' },
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
