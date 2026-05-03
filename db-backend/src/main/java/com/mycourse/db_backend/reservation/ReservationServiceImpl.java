package com.mycourse.db_backend.reservation;

import com.mycourse.db_backend.account.UserAccount;
import com.mycourse.db_backend.account.UserAccountRepository;
import com.mycourse.db_backend.common.BusinessException;
import com.mycourse.db_backend.pricing.PricingPolicy;
import com.mycourse.db_backend.pricing.PricingPolicyRepository;
import com.mycourse.db_backend.space.Space;
import com.mycourse.db_backend.space.SpaceRepository;
import com.mycourse.db_backend.user.User;
import com.mycourse.db_backend.user.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.Duration;
import java.time.LocalDateTime;
import java.util.List;
/**
 * 预约服务实现类，负责落实具体业务规则。
 */
@Service
public class ReservationServiceImpl implements ReservationService {
/**
 * 预约仓库，用来访问数据库。
 */
private final ReservationRepository reservationRepository;
/**
 * 空间时间lock仓库，用来访问数据库。
 */
private final SpaceTimeLockRepository lockRepository;
/**
 * 用户仓库，用来访问数据库。
 */
private final UserRepository userRepository;
/**
 * 空间仓库，用来访问数据库。
 */
private final SpaceRepository spaceRepository;
/**
 * 计费策略仓库，用来访问数据库。
 */
private final PricingPolicyRepository pricingPolicyRepository;
/**
 * 用户账户仓库，用来访问数据库。
 */
private final UserAccountRepository userAccountRepository;
    /**
     * 创建新的预约记录，并同时写入时间锁。
     */
@Override
    @Transactional
    public Reservation createReservation(ReservationCreateRequest request) {
        LocalDateTime now = LocalDateTime.now();
        if (!request.getEndTime().isAfter(request.getStartTime())) {
            throw new BusinessException("End time must be after start time");
        }
        if (request.getStartTime().isBefore(now)) {
            throw new BusinessException("Start time cannot be in the past");
        }
        User user = userRepository.findById(request.getUserId()).orElseThrow(() -> new BusinessException("User does not exist"));
        if (Integer.valueOf(1).equals(user.getIsDeleted())) {
            throw new BusinessException("User has been deleted");
        }
        if (!"ACTIVE".equals(user.getAccountStatus())) {
            throw new BusinessException("Current user status does not allow reservations");
        }
        UserAccount account = userAccountRepository.findById(request.getUserId()).orElse(null);
        if (account != null && account.getArrearsAmount() != null && account.getArrearsAmount().compareTo(BigDecimal.ZERO) > 0) {
            throw new BusinessException("User has unpaid bills and cannot create a new reservation");
        }
        Space space = spaceRepository.findById(request.getSpaceId()).orElseThrow(() -> new BusinessException("Space does not exist"));
        if (Integer.valueOf(1).equals(space.getIsDeleted()) || !"ACTIVE".equals(space.getStatus())) {
            throw new BusinessException("Space is not available for reservation");
        }
        PricingPolicy policy = pricingPolicyRepository.findById(space.getPolicyId()).orElseThrow(() -> new BusinessException("Pricing policy does not exist"));
        if (Integer.valueOf(1).equals(policy.getIsDeleted()) || Integer.valueOf(0).equals(policy.getIsActive())) {
            throw new BusinessException("Pricing policy is disabled");
        }
        long totalMinutes = Duration.between(request.getStartTime(), request.getEndTime()).toMinutes();
        if (totalMinutes > policy.getMaxReserveHours() * 60L) {
            throw new BusinessException("Reservation duration exceeds the policy limit");
        }
        boolean conflict = lockRepository.existsActiveConflict(request.getSpaceId(), request.getStartTime(), request.getEndTime());
        if (conflict) {
            throw new BusinessException("The selected time slot is already occupied");
        }
        BigDecimal estimatedAmount = calculateEstimatedAmount(policy, totalMinutes);
        Reservation reservation = new Reservation();
        reservation.setReservationNo("RES" + System.currentTimeMillis());
        reservation.setUserId(request.getUserId());
        reservation.setSpaceId(request.getSpaceId());
        reservation.setPolicyId(policy.getPolicyId());
        reservation.setReservationType("ONLINE");
        reservation.setStartTime(request.getStartTime());
        reservation.setEndTime(request.getEndTime());
        reservation.setReservationStatus("CONFIRMED");
        reservation.setChargeModeSnapshot(policy.getChargeMode());
        reservation.setHourlyPriceSnapshot(policy.getHourlyPrice());
        reservation.setFreeMinutesSnapshot(policy.getFreeMinutes());
        reservation.setMaxReserveHoursSnapshot(policy.getMaxReserveHours());
        reservation.setDepositAmountSnapshot(policy.getDepositAmount());
        reservation.setOvertimeMultiplierSnapshot(policy.getOvertimePriceMultiplier());
        reservation.setAmountEstimated(estimatedAmount);
        reservation.setCreatedAt(now);
        reservation.setUpdatedAt(now);
        Reservation saved = reservationRepository.save(reservation);
        SpaceTimeLock lock = new SpaceTimeLock();
        lock.setSpaceId(saved.getSpaceId());
        lock.setReservationId(saved.getReservationId());
        lock.setLockSegmentNo(1);
        lock.setLockType("RESERVATION");
        lock.setLockStartTime(saved.getStartTime());
        lock.setLockEndTime(saved.getEndTime());
        lock.setLockStatus("ACTIVE");
        lock.setCreatedAt(now);
        lock.setUpdatedAt(now);
        lockRepository.save(lock);
        return saved;
    }
    /**
     * 查询by用户ID列表。
     */
@Override
    public List<Reservation> listByUserId(Long userId) {
        return reservationRepository.findByUserIdOrderByCreatedAtDesc(userId);
    }
    /**
     * 取消指定预约，并释放关联的时间锁。
     */
@Override
    @Transactional
    public Reservation cancelReservation(Long reservationId, String reason) {
        Reservation reservation = reservationRepository.findById(reservationId).orElseThrow(() -> new BusinessException("Reservation does not exist"));
        if ("CANCELLED".equals(reservation.getReservationStatus())) {
            throw new BusinessException("Reservation has already been cancelled");
        }
        if (!"CONFIRMED".equals(reservation.getReservationStatus())) {
            throw new BusinessException("Only confirmed reservations can be cancelled");
        }
        LocalDateTime now = LocalDateTime.now();
        reservation.setReservationStatus("CANCELLED");
        reservation.setCancelReason(reason == null || reason.isBlank() ? "Cancelled by user" : reason);
        reservation.setCancelTime(now);
        reservation.setUpdatedAt(now);
        List<SpaceTimeLock> locks = lockRepository.findByReservationId(reservationId);
        for (SpaceTimeLock lock : locks) {
            lock.setLockStatus("RELEASED");
            lock.setUpdatedAt(now);
        }
        lockRepository.saveAll(locks);
        return reservationRepository.save(reservation);
    }
/**
 * 计算estimated金额。
 */
private BigDecimal calculateEstimatedAmount(PricingPolicy policy, long totalMinutes) {
        if ("FREE".equals(policy.getChargeMode())) {
            return BigDecimal.ZERO;
        }
        long billableMinutes = Math.max(0, totalMinutes - policy.getFreeMinutes());
        return policy.getHourlyPrice().multiply(BigDecimal.valueOf(billableMinutes)).divide(BigDecimal.valueOf(60), 2, RoundingMode.HALF_UP);
    }
/**
 * 构造ReservationServiceImpl，并注入当前类运行所需的依赖对象。
 */
public ReservationServiceImpl(final ReservationRepository reservationRepository, final SpaceTimeLockRepository lockRepository, final UserRepository userRepository, final SpaceRepository spaceRepository, final PricingPolicyRepository pricingPolicyRepository, final UserAccountRepository userAccountRepository) {
        this.reservationRepository = reservationRepository;
        this.lockRepository = lockRepository;
        this.userRepository = userRepository;
        this.spaceRepository = spaceRepository;
        this.pricingPolicyRepository = pricingPolicyRepository;
        this.userAccountRepository = userAccountRepository;
    }
}
