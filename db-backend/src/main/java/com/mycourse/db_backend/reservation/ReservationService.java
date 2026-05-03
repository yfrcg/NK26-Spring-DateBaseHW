package com.mycourse.db_backend.reservation;

import java.util.List;
/**
 * 预约服务接口，用来定义对外提供的业务能力。
 */
public interface ReservationService {
/**
 * 创建新的预约记录，并同时写入时间锁。
 */
Reservation createReservation(ReservationCreateRequest request);
/**
 * 查询by用户ID列表。
 */
List<Reservation> listByUserId(Long userId);
/**
 * 取消指定预约，并释放关联的时间锁。
 */
Reservation cancelReservation(Long reservationId, String reason);
}
