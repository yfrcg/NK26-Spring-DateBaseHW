package com.mycourse.db_backend.session;
/**
 * usage会话服务接口，用来定义对外提供的业务能力。
 */
public interface UsageSessionService {
/**
 * 为预约执行签到并开启使用会话。
 */
UsageSession checkIn(Long reservationId);
/**
 * 把当前使用中的会话切换为暂离状态。
 */
UsageSession tempHold(Long reservationId);
/**
 * 从暂离状态恢复继续使用。
 */
UsageSession resume(Long reservationId);
/**
 * 执行签退并完成费用结算。
 */
UsageSession checkOut(Long reservationId);
/**
 * 把暂离超时的会话标记为异常结束。
 */
UsageSession markHoldTimeout(Long reservationId);
/**
 * 获取by预约ID。
 */
UsageSession getByReservationId(Long reservationId);
}
