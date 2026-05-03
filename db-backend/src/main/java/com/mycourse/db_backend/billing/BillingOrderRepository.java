package com.mycourse.db_backend.billing;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
/**
 * 账单order仓库接口，负责访问数据库中的相关数据。
 */
public interface BillingOrderRepository extends JpaRepository<BillingOrder, Long> {
/**
 * 按照预约ID查询数据。
 */
Optional<BillingOrder> findByReservationId(Long reservationId);
/**
 * 按照用户IDorderby创建atdesc查询数据。
 */
List<BillingOrder> findByUserIdOrderByCreatedAtDesc(Long userId);
/**
 * 按照用户IDandbill状态orderby创建atasc查询数据。
 */
List<BillingOrder> findByUserIdAndBillStatusOrderByCreatedAtAsc(Long userId, String billStatus);
}
