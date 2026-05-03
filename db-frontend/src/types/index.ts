export interface Result<T> {
  code: number;
  message: string;
  data: T;
}

export interface User {
  userId: number;
  userNo: string;
  realName: string;
  phone: string | null;
  email: string | null;
  userType: string;
  accountStatus: string;
  creditScore: number;
  lastLoginTime: string | null;
  createdAt: string;
  updatedAt: string;
  isDeleted: number;
  deletedAt: string | null;
  deletedBy: number | null;
}

export interface LoginRequest {
  userNo: string;
  password: string;
}

export interface RegisterRequest {
  userNo: string;
  realName: string;
  phone?: string;
  email?: string;
  password: string;
  userType?: string;
}

export interface ChangePasswordRequest {
  currentPassword: string;
  newPassword: string;
}

export interface AuthResponse {
  token: string;
  user: User;
}

export type UserCreateRequest = RegisterRequest;

export interface UserAccount {
  userId: number;
  balance: number;
  frozenAmount: number;
  arrearsAmount: number;
  totalRecharge: number;
  totalSpend: number;
  versionNo: number;
  lastSettlementTime: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface AccountTransaction {
  txnId: number;
  txnNo: string;
  accountUserId: number;
  reservationId: number | null;
  billId: number | null;
  txnType: string;
  direction: string;
  amount: number;
  beforeBalance: number;
  afterBalance: number;
  operatorUserId: number | null;
  remark: string | null;
  createdAt: string;
}

export interface RechargeRequest {
  amount: number;
}

export interface Space {
  spaceId: number;
  locationId: number;
  policyId: number;
  spaceCode: string;
  spaceName: string;
  spaceType: string;
  capacity: number;
  equipmentDesc: string | null;
  status: string;
  sortNo: number;
  createdAt: string;
  updatedAt: string;
  isDeleted: number;
}

export interface Location {
  locationId: number;
  parentLocationId: number | null;
  locationCode: string;
  locationName: string;
  locationType: string;
  floorNo: string | null;
  roomNo: string | null;
  openTime: string;
  closeTime: string;
  status: string;
  remarks: string | null;
  createdAt: string;
  updatedAt: string;
  isDeleted: number;
  deletedAt: string | null;
  deletedBy: number | null;
}

export interface LocationTreeVO {
  locationId: number;
  parentLocationId: number | null;
  locationCode: string;
  locationName: string;
  locationType: string;
  floorNo: string | null;
  roomNo: string | null;
  status: string;
  children: LocationTreeVO[];
}

export interface LocationCreateRequest {
  parentLocationId?: number | null;
  locationCode: string;
  locationName: string;
  locationType: string;
  floorNo?: string;
  roomNo?: string;
  openTime: string;
  closeTime: string;
  remarks?: string;
}

export interface Reservation {
  reservationId: number;
  reservationNo: string;
  userId: number;
  spaceId: number;
  policyId: number;
  reservationType: string;
  startTime: string;
  endTime: string;
  reservationStatus: string;
  chargeModeSnapshot: string;
  hourlyPriceSnapshot: number;
  freeMinutesSnapshot: number;
  maxReserveHoursSnapshot: number;
  depositAmountSnapshot: number;
  overtimeMultiplierSnapshot: number;
  amountEstimated: number;
  cancelReason: string | null;
  cancelTime: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface ReservationCreateRequest {
  userId: number;
  spaceId: number;
  startTime: string;
  endTime: string;
}

export interface BillingOrder {
  billId: number;
  billNo: string;
  reservationId: number;
  userId: number;
  billStatus: string;
  baseAmount: number;
  overtimeAmount: number;
  discountAmount: number;
  payableAmount: number;
  paidAmount: number;
  settledAt: string | null;
  remarks: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface CreditTransaction {
  creditTxnId: number;
  userId: number;
  reservationId: number | null;
  sessionId: number | null;
  eventType: string;
  changeScore: number;
  beforeScore: number;
  afterScore: number;
  operatorUserId: number | null;
  reasonText: string | null;
  createdAt: string;
}

export interface CreditAdjustRequest {
  changeScore: number;
  reason?: string;
  operatorUserId?: number | null;
}

export interface UsageSession {
  sessionId: number;
  reservationId: number;
  checkInTime: string | null;
  checkOutTime: string | null;
  actualMinutes: number;
  overtimeMinutes: number;
  holdStartTime: string | null;
  holdExpireTime: string | null;
  holdCount: number;
  totalHoldMinutes: number;
  sessionStatus: string;
  operatorUserId: number | null;
  notes: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface PricingPolicy {
  policyId: number;
  policyCode: string;
  policyName: string;
  chargeMode: string;
  hourlyPrice: number;
  freeMinutes: number;
  maxReserveHours: number;
  depositAmount: number;
  overtimePriceMultiplier: number;
  allowTempHold: number;
  tempHoldLimitMinutes: number;
  tempHoldMaxCount: number;
  isActive: number;
  validFrom: string;
  validTo: string | null;
  remarks: string | null;
  createdAt: string;
  updatedAt: string;
  isDeleted: number;
}

export interface DashboardVO {
  todayReservationCount: number;
  todayCheckInCount: number;
  todayRevenue: number;
  unpaidBillCount: number;
  activeUserCount: number;
}

export interface TopSpaceVO {
  spaceId: number;
  spaceName: string;
  reservationCount: number;
}

export interface CreditEventStatVO {
  eventType: string;
  eventCount: number;
}

export interface SpaceRuntimeStatus {
  spaceId: number;
  currentStatus: string;
  currentReservationId: number | null;
  currentSessionId: number | null;
  statusSince: string;
  holdExpireTime: string | null;
  createdAt: string;
  updatedAt: string;
}
