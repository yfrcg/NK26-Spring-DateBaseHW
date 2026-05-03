package com.mycourse.db_backend.session;

import com.mycourse.db_backend.account.AccountTransaction;
import com.mycourse.db_backend.account.AccountTransactionRepository;
import com.mycourse.db_backend.account.UserAccount;
import com.mycourse.db_backend.account.UserAccountRepository;
import com.mycourse.db_backend.billing.BillingOrder;
import com.mycourse.db_backend.billing.BillingOrderRepository;
import com.mycourse.db_backend.common.BusinessException;
import com.mycourse.db_backend.credit.CreditService;
import com.mycourse.db_backend.pricing.PricingPolicy;
import com.mycourse.db_backend.pricing.PricingPolicyRepository;
import com.mycourse.db_backend.reservation.Reservation;
import com.mycourse.db_backend.reservation.ReservationRepository;
import com.mycourse.db_backend.runtime.SpaceRuntimeStatus;
import com.mycourse.db_backend.runtime.SpaceRuntimeStatusRepository;
import com.mycourse.db_backend.user.User;
import com.mycourse.db_backend.user.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.Duration;
import java.time.LocalDateTime;
/**
 * usage会话服务实现类，负责落实具体业务规则。
 */
@Service
public class UsageSessionServiceImpl implements UsageSessionService {
/**
 * usage会话仓库，用来访问数据库。
 */
private final UsageSessionRepository usageSessionRepository;
/**
 * 预约仓库，用来访问数据库。
 */
private final ReservationRepository reservationRepository;
/**
 * 计费策略仓库，用来访问数据库。
 */
private final PricingPolicyRepository pricingPolicyRepository;
/**
 * 空间运行状态仓库，用来访问数据库。
 */
private final SpaceRuntimeStatusRepository runtimeStatusRepository;
/**
 * 账单order仓库，用来访问数据库。
 */
private final BillingOrderRepository billingOrderRepository;
/**
 * 用户账户仓库，用来访问数据库。
 */
private final UserAccountRepository userAccountRepository;
/**
 * 账户流水仓库，用来访问数据库。
 */
private final AccountTransactionRepository accountTransactionRepository;
/**
 * 信用服务，用来复用相关业务逻辑。
 */
private final CreditService creditService;
/**
 * 用户仓库，用来访问数据库。
 */
private final UserRepository userRepository;
    /**
     * 为预约执行签到并开启使用会话。
     */
@Override
    @Transactional
    public UsageSession checkIn(Long reservationId) {
        Reservation reservation = getReservation(reservationId);
        if (!"CONFIRMED".equals(reservation.getReservationStatus())) {
            throw new BusinessException("Only confirmed reservations can be checked in");
        }
        LocalDateTime now = LocalDateTime.now();
        if (now.isBefore(reservation.getStartTime())) {
            throw new BusinessException("Check-in is not available before the reservation start time");
        }
        if (now.isAfter(reservation.getEndTime())) {
            throw new BusinessException("Reservation has already ended");
        }
        UsageSession session = usageSessionRepository.findByReservationId(reservationId).orElseGet(() -> createEmptySession(reservationId));
        if (session.getCheckInTime() != null) {
            throw new BusinessException("Reservation has already been checked in");
        }
        session.setCheckInTime(now);
        session.setSessionStatus("IN_USE");
        session.setUpdatedAt(now);
        UsageSession saved = usageSessionRepository.save(session);
        reservation.setReservationStatus("IN_USE");
        reservation.setUpdatedAt(now);
        reservationRepository.save(reservation);
        updateRuntimeStatus(reservation.getSpaceId(), "IN_USE", reservation.getReservationId(), saved.getSessionId(), now, null);
        return saved;
    }
    /**
     * 把当前使用中的会话切换为暂离状态。
     */
@Override
    @Transactional
    public UsageSession tempHold(Long reservationId) {
        Reservation reservation = getReservation(reservationId);
        UsageSession session = getSessionByReservationIdInternal(reservationId);
        if (!"IN_USE".equals(session.getSessionStatus())) {
            throw new BusinessException("Temporary hold is only allowed while the space is in use");
        }
        PricingPolicy policy = pricingPolicyRepository.findById(reservation.getPolicyId()).orElseThrow(() -> new BusinessException("Pricing policy does not exist"));
        if (policy.getAllowTempHold() == null || policy.getAllowTempHold() == 0) {
            throw new BusinessException("Temporary hold is disabled for this pricing policy");
        }
        if (session.getHoldCount() >= policy.getTempHoldMaxCount()) {
            throw new BusinessException("Temporary hold count has reached the policy limit");
        }
        LocalDateTime now = LocalDateTime.now();
        LocalDateTime expire = now.plusMinutes(policy.getTempHoldLimitMinutes());
        session.setHoldStartTime(now);
        session.setHoldExpireTime(expire);
        session.setHoldCount(session.getHoldCount() + 1);
        session.setSessionStatus("TEMP_HOLD");
        session.setUpdatedAt(now);
        UsageSession saved = usageSessionRepository.save(session);
        updateRuntimeStatus(reservation.getSpaceId(), "TEMP_HOLD", reservation.getReservationId(), saved.getSessionId(), now, expire);
        return saved;
    }
    /**
     * 从暂离状态恢复继续使用。
     */
@Override
    @Transactional
    public UsageSession resume(Long reservationId) {
        Reservation reservation = getReservation(reservationId);
        UsageSession session = getSessionByReservationIdInternal(reservationId);
        if (!"TEMP_HOLD".equals(session.getSessionStatus())) {
            throw new BusinessException("Current session is not in temporary hold status");
        }
        if (session.getHoldExpireTime() != null && LocalDateTime.now().isAfter(session.getHoldExpireTime())) {
            return markHoldTimeout(reservationId);
        }
        if (session.getHoldStartTime() == null) {
            throw new BusinessException("Temporary hold start time is missing");
        }
        LocalDateTime now = LocalDateTime.now();
        int addedHoldMinutes = (int) Duration.between(session.getHoldStartTime(), now).toMinutes();
        if (addedHoldMinutes < 0) {
            addedHoldMinutes = 0;
        }
        session.setTotalHoldMinutes(session.getTotalHoldMinutes() + addedHoldMinutes);
        session.setHoldStartTime(null);
        session.setHoldExpireTime(null);
        session.setSessionStatus("IN_USE");
        session.setUpdatedAt(now);
        UsageSession saved = usageSessionRepository.save(session);
        updateRuntimeStatus(reservation.getSpaceId(), "IN_USE", reservation.getReservationId(), saved.getSessionId(), now, null);
        return saved;
    }
    /**
     * 执行签退并完成费用结算。
     */
@Override
    @Transactional
    public UsageSession checkOut(Long reservationId) {
        Reservation reservation = getReservation(reservationId);
        UsageSession session = getSessionByReservationIdInternal(reservationId);
        if (!"IN_USE".equals(session.getSessionStatus()) && !"TEMP_HOLD".equals(session.getSessionStatus())) {
            throw new BusinessException("Current session status cannot be checked out");
        }
        if (session.getCheckInTime() == null) {
            throw new BusinessException("Check-in is required before check-out");
        }
        LocalDateTime now = LocalDateTime.now();
        int totalHoldMinutes = session.getTotalHoldMinutes();
        if ("TEMP_HOLD".equals(session.getSessionStatus()) && session.getHoldStartTime() != null) {
            int extraHold = (int) Duration.between(session.getHoldStartTime(), now).toMinutes();
            if (extraHold > 0) {
                totalHoldMinutes += extraHold;
            }
        }
        int totalDurationMinutes = (int) Duration.between(session.getCheckInTime(), now).toMinutes();
        if (totalDurationMinutes < 0) {
            totalDurationMinutes = 0;
        }
        int actualMinutes = Math.max(0, totalDurationMinutes - totalHoldMinutes);
        int overtimeMinutes = 0;
        if (now.isAfter(reservation.getEndTime())) {
            overtimeMinutes = (int) Duration.between(reservation.getEndTime(), now).toMinutes();
        }
        session.setCheckOutTime(now);
        session.setActualMinutes(actualMinutes);
        session.setOvertimeMinutes(Math.max(0, overtimeMinutes));
        session.setTotalHoldMinutes(totalHoldMinutes);
        session.setHoldStartTime(null);
        session.setHoldExpireTime(null);
        session.setSessionStatus("ENDED");
        session.setUpdatedAt(now);
        UsageSession savedSession = usageSessionRepository.save(session);
        reservation.setReservationStatus("FINISHED");
        reservation.setUpdatedAt(now);
        reservationRepository.save(reservation);
        createOrUpdateBillAndTryPay(reservation, savedSession);
        creditService.deductForOvertimeIfNeeded(reservation, savedSession);
        updateRuntimeStatus(reservation.getSpaceId(), "IDLE", null, null, now, null);
        return savedSession;
    }
    /**
     * 把暂离超时的会话标记为异常结束。
     */
@Override
    @Transactional
    public UsageSession markHoldTimeout(Long reservationId) {
        Reservation reservation = getReservation(reservationId);
        UsageSession session = getSessionByReservationIdInternal(reservationId);
        if (!"TEMP_HOLD".equals(session.getSessionStatus())) {
            throw new BusinessException("Current session is not in temporary hold status");
        }
        if (session.getHoldStartTime() == null || session.getHoldExpireTime() == null) {
            throw new BusinessException("Temporary hold state is incomplete");
        }
        LocalDateTime timeoutTime = session.getHoldExpireTime();
        int extraHoldMinutes = (int) Duration.between(session.getHoldStartTime(), timeoutTime).toMinutes();
        if (extraHoldMinutes < 0) {
            extraHoldMinutes = 0;
        }
        int totalHoldMinutes = session.getTotalHoldMinutes() + extraHoldMinutes;
        int totalDurationMinutes = 0;
        if (session.getCheckInTime() != null) {
            totalDurationMinutes = (int) Duration.between(session.getCheckInTime(), timeoutTime).toMinutes();
            if (totalDurationMinutes < 0) {
                totalDurationMinutes = 0;
            }
        }
        int actualMinutes = Math.max(0, totalDurationMinutes - totalHoldMinutes);
        int overtimeMinutes = 0;
        if (timeoutTime.isAfter(reservation.getEndTime())) {
            overtimeMinutes = (int) Duration.between(reservation.getEndTime(), timeoutTime).toMinutes();
        }
        session.setCheckOutTime(timeoutTime);
        session.setActualMinutes(actualMinutes);
        session.setOvertimeMinutes(Math.max(0, overtimeMinutes));
        session.setTotalHoldMinutes(totalHoldMinutes);
        session.setHoldStartTime(null);
        session.setHoldExpireTime(null);
        session.setSessionStatus("ABNORMAL");
        session.setUpdatedAt(LocalDateTime.now());
        UsageSession savedSession = usageSessionRepository.save(session);
        reservation.setReservationStatus("FINISHED");
        reservation.setUpdatedAt(LocalDateTime.now());
        reservationRepository.save(reservation);
        createOrUpdateBillAndTryPay(reservation, savedSession);
        creditService.deductForHoldTimeout(reservation, savedSession);
        creditService.deductForOvertimeIfNeeded(reservation, savedSession);
        updateRuntimeStatus(reservation.getSpaceId(), "IDLE", null, null, LocalDateTime.now(), null);
        return savedSession;
    }
    /**
     * 获取by预约ID。
     */
@Override
    public UsageSession getByReservationId(Long reservationId) {
        return getSessionByReservationIdInternal(reservationId);
    }
/**
 * 获取预约。
 */
private Reservation getReservation(Long reservationId) {
        return reservationRepository.findById(reservationId).orElseThrow(() -> new BusinessException("Reservation does not exist"));
    }
/**
 * 获取会话by预约IDinternal。
 */
private UsageSession getSessionByReservationIdInternal(Long reservationId) {
        return usageSessionRepository.findByReservationId(reservationId).orElseThrow(() -> new BusinessException("Usage session does not exist"));
    }
/**
 * 创建empty会话。
 */
private UsageSession createEmptySession(Long reservationId) {
        LocalDateTime now = LocalDateTime.now();
        UsageSession session = new UsageSession();
        session.setReservationId(reservationId);
        session.setActualMinutes(0);
        session.setOvertimeMinutes(0);
        session.setHoldCount(0);
        session.setTotalHoldMinutes(0);
        session.setSessionStatus("NOT_STARTED");
        session.setCreatedAt(now);
        session.setUpdatedAt(now);
        return usageSessionRepository.save(session);
    }
/**
 * 更新运行状态。
 */
private void updateRuntimeStatus(Long spaceId, String status, Long reservationId, Long sessionId, LocalDateTime statusSince, LocalDateTime holdExpireTime) {
        SpaceRuntimeStatus runtime = runtimeStatusRepository.findById(spaceId).orElseGet(() -> {
            SpaceRuntimeStatus current = new SpaceRuntimeStatus();
            current.setSpaceId(spaceId);
            current.setCreatedAt(LocalDateTime.now());
            return current;
        });
        runtime.setCurrentStatus(status);
        runtime.setCurrentReservationId(reservationId);
        runtime.setCurrentSessionId(sessionId);
        runtime.setStatusSince(statusSince);
        runtime.setHoldExpireTime(holdExpireTime);
        runtime.setUpdatedAt(LocalDateTime.now());
        runtimeStatusRepository.save(runtime);
    }
/**
 * 创建orupdatebillandtrypay。
 */
private void createOrUpdateBillAndTryPay(Reservation reservation, UsageSession session) {
        LocalDateTime now = LocalDateTime.now();
        BillingOrder bill = billingOrderRepository.findByReservationId(reservation.getReservationId()).orElseGet(() -> {
            BillingOrder created = new BillingOrder();
            created.setBillNo("BILL" + System.currentTimeMillis());
            created.setReservationId(reservation.getReservationId());
            created.setUserId(reservation.getUserId());
            created.setCreatedAt(now);
            return created;
        });
        BigDecimal baseAmount = calculateBaseAmount(reservation, session.getActualMinutes());
        BigDecimal overtimeAmount = calculateOvertimeAmount(reservation, session.getOvertimeMinutes());
        BigDecimal payableAmount = baseAmount.add(overtimeAmount);
        bill.setBaseAmount(baseAmount);
        bill.setOvertimeAmount(overtimeAmount);
        bill.setDiscountAmount(BigDecimal.ZERO);
        bill.setPayableAmount(payableAmount);
        bill.setUpdatedAt(now);
        bill.setRemarks("Usage finished and settled automatically");
        UserAccount account = userAccountRepository.findById(reservation.getUserId()).orElseGet(() -> createEmptyAccount(reservation.getUserId()));
        User user = userRepository.findById(reservation.getUserId()).orElseThrow(() -> new BusinessException("User does not exist"));
        if (payableAmount.compareTo(BigDecimal.ZERO) == 0) {
            bill.setBillStatus("PAID");
            bill.setPaidAmount(BigDecimal.ZERO);
            bill.setSettledAt(now);
            billingOrderRepository.save(bill);
            return;
        }
        if (account.getBalance().compareTo(payableAmount) >= 0) {
            BigDecimal before = account.getBalance();
            BigDecimal after = before.subtract(payableAmount);
            account.setBalance(after);
            account.setTotalSpend(account.getTotalSpend().add(payableAmount));
            account.setLastSettlementTime(now);
            account.setUpdatedAt(now);
            userAccountRepository.save(account);
            bill.setBillStatus("PAID");
            bill.setPaidAmount(payableAmount);
            bill.setSettledAt(now);
            BillingOrder savedBill = billingOrderRepository.save(bill);
            AccountTransaction txn = new AccountTransaction();
            txn.setTxnNo("TXN" + System.currentTimeMillis());
            txn.setAccountUserId(reservation.getUserId());
            txn.setReservationId(reservation.getReservationId());
            txn.setBillId(savedBill.getBillId());
            txn.setTxnType("CONSUME");
            txn.setDirection("OUT");
            txn.setAmount(payableAmount);
            txn.setBeforeBalance(before);
            txn.setAfterBalance(after);
            txn.setRemark("Reservation settlement deduction");
            txn.setCreatedAt(now);
            accountTransactionRepository.save(txn);
            return;
        }
        account.setArrearsAmount(account.getArrearsAmount().add(payableAmount));
        account.setUpdatedAt(now);
        userAccountRepository.save(account);
        user.setAccountStatus("ARREARS_LOCKED");
        user.setUpdatedAt(now);
        userRepository.save(user);
        bill.setBillStatus("UNPAID");
        bill.setPaidAmount(BigDecimal.ZERO);
        bill.setSettledAt(null);
        billingOrderRepository.save(bill);
    }
/**
 * 创建empty账户。
 */
private UserAccount createEmptyAccount(Long userId) {
        LocalDateTime now = LocalDateTime.now();
        UserAccount account = new UserAccount();
        account.setUserId(userId);
        account.setBalance(BigDecimal.ZERO);
        account.setFrozenAmount(BigDecimal.ZERO);
        account.setArrearsAmount(BigDecimal.ZERO);
        account.setTotalRecharge(BigDecimal.ZERO);
        account.setTotalSpend(BigDecimal.ZERO);
        account.setVersionNo(0);
        account.setCreatedAt(now);
        account.setUpdatedAt(now);
        return userAccountRepository.save(account);
    }
/**
 * 计算base金额。
 */
private BigDecimal calculateBaseAmount(Reservation reservation, Integer actualMinutes) {
        if ("FREE".equals(reservation.getChargeModeSnapshot())) {
            return BigDecimal.ZERO;
        }
        int billableMinutes = Math.max(0, actualMinutes - reservation.getFreeMinutesSnapshot());
        return reservation.getHourlyPriceSnapshot().multiply(BigDecimal.valueOf(billableMinutes)).divide(BigDecimal.valueOf(60), 2, RoundingMode.HALF_UP);
    }
/**
 * 计算超时金额。
 */
private BigDecimal calculateOvertimeAmount(Reservation reservation, Integer overtimeMinutes) {
        if ("FREE".equals(reservation.getChargeModeSnapshot())) {
            return BigDecimal.ZERO;
        }
        if (overtimeMinutes == null || overtimeMinutes <= 0) {
            return BigDecimal.ZERO;
        }
        return reservation.getHourlyPriceSnapshot().multiply(reservation.getOvertimeMultiplierSnapshot()).multiply(BigDecimal.valueOf(overtimeMinutes)).divide(BigDecimal.valueOf(60), 2, RoundingMode.HALF_UP);
    }
/**
 * 构造UsageSessionServiceImpl，并注入当前类运行所需的依赖对象。
 */
public UsageSessionServiceImpl(final UsageSessionRepository usageSessionRepository, final ReservationRepository reservationRepository, final PricingPolicyRepository pricingPolicyRepository, final SpaceRuntimeStatusRepository runtimeStatusRepository, final BillingOrderRepository billingOrderRepository, final UserAccountRepository userAccountRepository, final AccountTransactionRepository accountTransactionRepository, final CreditService creditService, final UserRepository userRepository) {
        this.usageSessionRepository = usageSessionRepository;
        this.reservationRepository = reservationRepository;
        this.pricingPolicyRepository = pricingPolicyRepository;
        this.runtimeStatusRepository = runtimeStatusRepository;
        this.billingOrderRepository = billingOrderRepository;
        this.userAccountRepository = userAccountRepository;
        this.accountTransactionRepository = accountTransactionRepository;
        this.creditService = creditService;
        this.userRepository = userRepository;
    }
}
