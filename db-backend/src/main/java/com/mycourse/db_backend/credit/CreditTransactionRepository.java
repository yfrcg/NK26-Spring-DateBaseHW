package com.mycourse.db_backend.credit;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
/**
 * 信用流水仓库接口，负责访问数据库中的相关数据。
 */
public interface CreditTransactionRepository extends JpaRepository<CreditTransaction, Long> {
/**
 * 按照用户IDorderby创建atdesc查询数据。
 */
List<CreditTransaction> findByUserIdOrderByCreatedAtDesc(Long userId);
/**
 * 判断预约IDand事件类型是否存在。
 */
boolean existsByReservationIdAndEventType(Long reservationId, String eventType);
}
