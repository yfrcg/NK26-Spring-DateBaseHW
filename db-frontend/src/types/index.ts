export interface Result<T> {
  code: number
  message: string
  data: T
}

export interface LoginRequest {
  userNo: string
  password: string
}

export interface RegisterRequest {
  userNo: string
  realName: string
  phone?: string
  email?: string
  password: string
  userType?: string
}

export interface ChangePasswordRequest {
  currentPassword: string
  newPassword: string
}

export interface AuthResponse {
  token: string
  user: User
}

export interface User {
  userId: number
  userNo: string
  realName: string
  phone?: string
  email?: string
  userType: string
  accountStatus: string
  balance: number
  arrearsAmount: number
  totalRecharge: number
  totalSpend: number
  creditScore: number
  lastLoginTime?: string
  createdAt: string
  updatedAt: string
  isDeleted?: number
  deletedAt?: string
  deletedBy?: number
}

export interface UserAccount {
  userId: number
  balance: number
  arrearsAmount: number
  totalRecharge: number
  totalSpend: number
  createdAt: string
  updatedAt: string
}

export interface Transaction {
  txnId: number
  txnNo: string
  userId: number
  txnCategory: string
  txnType: string
  direction: string
  amount?: number
  beforeBalance?: number
  afterBalance?: number
  creditDelta?: number
  beforeScore?: number
  afterScore?: number
  operatorUserId?: number
  remark?: string
  createdAt: string
}

export interface RechargeRequest {
  amount: number
}

export interface Location {
  locationId: number
  parentLocationId?: number
  locationCode: string
  locationName: string
  locationType: string
  floorNo?: string
  roomNo?: string
  openTime: string
  closeTime: string
  status: string
  remarks?: string
  createdAt: string
  updatedAt: string
  isDeleted?: number
  deletedAt?: string
  deletedBy?: number
  children?: Location[]
}

export interface LocationTreeVO {
  locationId: number
  parentLocationId?: number
  locationCode: string
  locationName: string
  locationType: string
  floorNo?: string
  roomNo?: string
  status: string
  children?: LocationTreeVO[]
}

export interface LocationCreateRequest {
  parentLocationId?: number
  locationCode: string
  locationName: string
  locationType: string
  floorNo?: string
  roomNo?: string
  openTime: string
  closeTime: string
  remarks?: string
}

export interface Space {
  spaceId: number
  locationId: number
  policyId: number
  spaceCode: string
  spaceName: string
  spaceType: string
  capacity: number
  equipmentDesc?: string
  status: string
  sortNo: number
  createdAt: string
  updatedAt: string
  isDeleted?: number
}

export interface PricingPolicy {
  policyId: number
  policyCode: string
  policyName: string
  chargeMode: string
  hourlyPrice: number
  freeMinutes: number
  maxReserveHours: number
  overtimePriceMultiplier: number
  allowTempHold: number
  tempHoldLimitMinutes: number
  tempHoldMaxCount: number
  isActive: number
  validFrom: string
  validTo?: string
  remarks?: string
  createdAt: string
  updatedAt: string
  isDeleted?: number
}

export interface Reservation {
  reservationId: number
  reservationNo: string
  userId: number
  spaceId: number
  policyId: number
  reservationType: string
  startTime: string
  endTime: string
  reservationStatus: string
  chargeModeSnapshot: string
  hourlyPriceSnapshot: number
  freeMinutesSnapshot: number
  maxReserveHoursSnapshot: number
  overtimeMultiplierSnapshot: number
  amountEstimated: number
  cancelReason?: string
  cancelTime?: string
  createdAt: string
  updatedAt: string
}

export interface ReservationCreateRequest {
  userId: number
  spaceId: number
  startTime: string
  endTime: string
}

export interface UsageSession {
  sessionId: number
  reservationId: number
  checkInTime?: string
  checkOutTime?: string
  actualMinutes: number
  overtimeMinutes: number
  holdStartTime?: string
  holdExpireTime?: string
  holdCount: number
  sessionStatus: string
  operatorUserId?: number
  notes?: string
  createdAt: string
  updatedAt: string
}

export interface BillingOrder {
  billId: number
  billNo: string
  reservationId: number
  userId: number
  baseAmount: number
  overtimeAmount: number
  discountAmount: number
  payableAmount: number
  paidAmount: number
  billStatus: string
  settledAt?: string
  createdAt: string
  updatedAt: string
}

export interface CreditTransaction {
  txnId: number
  txnNo: string
  userId: number
  txnCategory: string
  txnType: string
  direction: string
  creditDelta?: number
  beforeScore?: number
  afterScore?: number
  operatorUserId?: number
  remark?: string
  createdAt: string
}

export interface CreditAdjustRequest {
  changeScore: number
  reason?: string
  operatorUserId?: number
}

export interface DashboardVO {
  todayReservationCount: number
  todayCheckInCount: number
  todayRevenue: number
  unpaidBillCount: number
  activeUserCount: number
  todayNoShowCount?: number
  todayRechargeAmount?: number
  todayConsumeAmount?: number
  topSpaces: TopSpaceVO[]
  creditEvents: CreditEventStatVO[]
}

export interface TopSpaceVO {
  spaceId: number
  spaceName: string
  reservationCount: number
}

export interface CreditEventStatVO {
  eventType: string
  eventCount: number
  totalDeducted?: number
  totalRestored?: number
}

export type UserCreateRequest = RegisterRequest
