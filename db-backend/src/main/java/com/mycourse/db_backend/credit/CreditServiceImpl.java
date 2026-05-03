package com.mycourse.db_backend.credit;

import java.time.LocalDateTime;
import java.util.List;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import com.mycourse.db_backend.common.BusinessException;
import com.mycourse.db_backend.reservation.Reservation;
import com.mycourse.db_backend.session.UsageSession;
import com.mycourse.db_backend.user.User;
import com.mycourse.db_backend.user.UserRepository;
/**
 * 信用服务实现类，负责落实具体业务规则。
 */
@Service
public class CreditServiceImpl implements CreditService {
/**
 * 保存noshowdeduct。
 */
private static final int NO_SHOW_DEDUCT = -15;
/**
 * 保存超时deduct。
 */
private static final int OVERTIME_DEDUCT = -5;
/**
 * 保存暂离timeoutdeduct。
 */
private static final int HOLD_TIMEOUT_DEDUCT = -10;
/**
 * 信用流水仓库，用来访问数据库。
 */
private final CreditTransactionRepository creditTransactionRepository;
/**
 * 用户仓库，用来访问数据库。
 */
private final UserRepository userRepository;
    /**
     * 查询by用户ID列表。
     */
@Override
    public List<CreditTransaction> listByUserId(Long userId) {
        return creditTransactionRepository.findByUserIdOrderByCreatedAtDesc(userId);
    }
    /**
     * 执行manualAdjust相关处理。
     */
@Override
    @Transactional
    public CreditTransaction manualAdjust(Long userId, Integer changeScore, String reason, Long operatorUserId) {
        if (changeScore == null || changeScore == 0) {
            throw new BusinessException("信用分变动不能为0");
        }
        String eventType = changeScore > 0 ? "MANUAL_RESTORE" : "MANUAL_ADJUST";
        return applyChange(userId, null, null, eventType, changeScore, reason == null || reason.isBlank() ? "管理员手工调整" : reason, operatorUserId);
    }
    /**
     * 执行for超时ifneeded扣减逻辑。
     */
@Override
    @Transactional
    public void deductForOvertimeIfNeeded(Reservation reservation, UsageSession session) {
        if (session.getOvertimeMinutes() == null || session.getOvertimeMinutes() <= 0) {
            return;
        }
        if (creditTransactionRepository.existsByReservationIdAndEventType(reservation.getReservationId(), "OVERTIME")) {
            return;
        }
        applyChange(reservation.getUserId(), reservation.getReservationId(), session.getSessionId(), "OVERTIME", OVERTIME_DEDUCT, "使用超时，自动扣减信用分", null);
    }
    /**
     * 执行fornoshow扣减逻辑。
     */
@Override
    @Transactional
    public void deductForNoShow(Reservation reservation, Long operatorUserId) {
        if (creditTransactionRepository.existsByReservationIdAndEventType(reservation.getReservationId(), "NO_SHOW")) {
            return;
        }
        applyChange(reservation.getUserId(), reservation.getReservationId(), null, "NO_SHOW", NO_SHOW_DEDUCT, "预约未签到，系统判定爽约", operatorUserId);
    }
    /**
     * 执行for暂离timeout扣减逻辑。
     */
@Override
    @Transactional
    public void deductForHoldTimeout(Reservation reservation, UsageSession session) {
        if (creditTransactionRepository.existsByReservationIdAndEventType(reservation.getReservationId(), "HOLD_TIMEOUT")) {
            return;
        }
        applyChange(reservation.getUserId(), reservation.getReservationId(), session.getSessionId(), "HOLD_TIMEOUT", HOLD_TIMEOUT_DEDUCT, "暂离超时未恢复，自动扣减信用分", null);
    }
/**
 * 执行applyChange相关处理。
 */
private CreditTransaction applyChange(Long userId, Long reservationId, Long sessionId, String eventType, Integer changeScore, String reason, Long operatorUserId) {
        User user = userRepository.findById(userId).orElseThrow(() -> new BusinessException("用户不存在"));
        if (user.getIsDeleted() != null && user.getIsDeleted() == 1) {
            throw new BusinessException("用户已被删除");
        }
        int before = user.getCreditScore() == null ? 100 : user.getCreditScore();
        int after = before + changeScore;
        if (after < 0) {
            after = 0;
        }
        if (after > 1000) {
            after = 1000;
        }
        user.setCreditScore(after);
        user.setUpdatedAt(LocalDateTime.now());
        if (after < 60) {
            user.setAccountStatus("SUSPENDED");
        } else if ("SUSPENDED".equals(user.getAccountStatus())) {
            user.setAccountStatus("ACTIVE");
        }
        userRepository.save(user);
        CreditTransaction record = new CreditTransaction();
        record.setUserId(userId);
        record.setReservationId(reservationId);
        record.setSessionId(sessionId);
        record.setEventType(eventType);
        record.setChangeScore(after - before);
        record.setBeforeScore(before);
        record.setAfterScore(after);
        record.setOperatorUserId(operatorUserId);
        record.setReasonText(reason);
        record.setCreatedAt(LocalDateTime.now());
        return creditTransactionRepository.save(record);
    }
/**
 * 构造CreditServiceImpl，并注入当前类运行所需的依赖对象。
 */
public CreditServiceImpl(final CreditTransactionRepository creditTransactionRepository, final UserRepository userRepository) {
        this.creditTransactionRepository = creditTransactionRepository;
        this.userRepository = userRepository;
    }
}
