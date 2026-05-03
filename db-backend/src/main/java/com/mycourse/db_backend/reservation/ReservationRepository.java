package com.mycourse.db_backend.reservation;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
/**
 * 预约仓库接口，负责访问数据库中的相关数据。
 */
public interface ReservationRepository extends JpaRepository<Reservation, Long> {
/**
 * 按照用户IDorderby创建atdesc查询数据。
 */
List<Reservation> findByUserIdOrderByCreatedAtDesc(Long userId);
/**
 * 按照预约状态and开始时间变动前查询数据。
 */
List<Reservation> findByReservationStatusAndStartTimeBefore(String reservationStatus, LocalDateTime startTime);
}
