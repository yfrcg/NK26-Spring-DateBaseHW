package com.mycourse.db_backend.credit;

import java.util.List;

import com.mycourse.db_backend.reservation.Reservation;
import com.mycourse.db_backend.session.UsageSession;
/**
 * 信用服务接口，用来定义对外提供的业务能力。
 */
public interface CreditService {
/**
 * 查询by用户ID列表。
 */
List<CreditTransaction> listByUserId(Long userId);
/**
 * 执行manualAdjust相关处理。
 */
CreditTransaction manualAdjust(Long userId, Integer changeScore, String reason, Long operatorUserId);
/**
 * 执行for超时ifneeded扣减逻辑。
 */
void deductForOvertimeIfNeeded(Reservation reservation, UsageSession session);
/**
 * 执行fornoshow扣减逻辑。
 */
void deductForNoShow(Reservation reservation, Long operatorUserId);
/**
 * 执行for暂离timeout扣减逻辑。
 */
void deductForHoldTimeout(Reservation reservation, UsageSession session);
}
