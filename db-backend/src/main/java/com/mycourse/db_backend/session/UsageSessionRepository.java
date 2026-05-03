package com.mycourse.db_backend.session;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
/**
 * usage会话仓库接口，负责访问数据库中的相关数据。
 */
public interface UsageSessionRepository extends JpaRepository<UsageSession, Long> {
/**
 * 按照预约ID查询数据。
 */
Optional<UsageSession> findByReservationId(Long reservationId);
/**
 * 按照会话状态and暂离expire时间变动前查询数据。
 */
List<UsageSession> findBySessionStatusAndHoldExpireTimeBefore(String sessionStatus, LocalDateTime holdExpireTime);
}
