package com.mycourse.db_backend.reservation;

import java.util.List;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import com.mycourse.db_backend.auth.AccessGuard;
import com.mycourse.db_backend.auth.AuthenticatedUser;
import com.mycourse.db_backend.common.BusinessException;
import com.mycourse.db_backend.common.Result;
import jakarta.validation.Valid;
/**
 * 预约控制器，负责接收前端请求并返回处理结果。
 */
@RestController
@RequestMapping("/api/reservations")
public class ReservationController {
/**
 * 预约服务，用来复用相关业务逻辑。
 */
private final ReservationService reservationService;
/**
 * 预约仓库，用来访问数据库。
 */
private final ReservationRepository reservationRepository;
/**
 * 保存访问控制。
 */
private final AccessGuard accessGuard;
    /**
     * 创建新的预约记录，并同时写入时间锁。
     */
@PostMapping
    public Result<Reservation> createReservation(@RequestBody @Valid ReservationCreateRequest request) {
        AuthenticatedUser currentUser = accessGuard.currentUser();
        if (!currentUser.isAdmin() || request.getUserId() == null) {
            request.setUserId(currentUser.userId());
        } else {
            accessGuard.requireSelfOrAdmin(request.getUserId());
        }
        return Result.success("Reservation created", reservationService.createReservation(request));
    }
    /**
     * 查询by用户ID列表。
     */
@GetMapping("/user/{userId}")
    public Result<List<Reservation>> listByUserId(@PathVariable Long userId) {
        accessGuard.requireSelfOrAdmin(userId);
        return Result.success(reservationService.listByUserId(userId));
    }
    /**
     * 取消指定预约，并释放关联的时间锁。
     */
@PostMapping("/{reservationId}/cancel")
    public Result<Reservation> cancelReservation(@PathVariable Long reservationId, @RequestBody(required = false) CancelRequest request) {
        Reservation reservation = reservationRepository.findById(reservationId).orElseThrow(() -> new BusinessException("Reservation does not exist"));
        accessGuard.requireSelfOrAdmin(reservation.getUserId());
        return Result.success("Cancelled successfully", reservationService.cancelReservation(reservationId, request == null ? null : request.getReason()));
    }
/**
 * 取消请求参数对象，用来封装接口入参。
 */
public static class CancelRequest {
/**
 * 保存原因说明。
 */
private String reason;
/**
 * 构造CancelRequest，并注入当前类运行所需的依赖对象。
 */
public CancelRequest() {
        }
/**
 * 获取原因说明。
 */
public String getReason() {
            return this.reason;
        }
/**
 * 设置原因说明。
 */
public void setReason(final String reason) {
            this.reason = reason;
        }
        /**
         * 比较当前对象和另一个对象是否表示同一份业务数据。
         */
@java.lang.Override
        public boolean equals(final java.lang.Object o) {
            if (o == this) return true;
            if (!(o instanceof ReservationController.CancelRequest)) return false;
            final ReservationController.CancelRequest other = (ReservationController.CancelRequest) o;
            if (!other.canEqual((java.lang.Object) this)) return false;
            final java.lang.Object this$reason = this.getReason();
            final java.lang.Object other$reason = other.getReason();
            if (this$reason == null ? other$reason != null : !this$reason.equals(other$reason)) return false;
            return true;
        }
/**
 * 配合 equals 方法使用，避免继承场景下的比较错误。
 */
protected boolean canEqual(final java.lang.Object other) {
            return other instanceof ReservationController.CancelRequest;
        }
        /**
         * 返回当前对象的哈希值，便于放入集合中使用。
         */
@java.lang.Override
        public int hashCode() {
            final int PRIME = 59;
            int result = 1;
            final java.lang.Object $reason = this.getReason();
            result = result * PRIME + ($reason == null ? 43 : $reason.hashCode());
            return result;
        }
        /**
         * 把当前对象转换成便于调试查看的字符串。
         */
@java.lang.Override
        public java.lang.String toString() {
            return "ReservationController.CancelRequest(reason=" + this.getReason() + ")";
        }
    }
/**
 * 构造ReservationController，并注入当前类运行所需的依赖对象。
 */
public ReservationController(final ReservationService reservationService, final ReservationRepository reservationRepository, final AccessGuard accessGuard) {
        this.reservationService = reservationService;
        this.reservationRepository = reservationRepository;
        this.accessGuard = accessGuard;
    }
}
