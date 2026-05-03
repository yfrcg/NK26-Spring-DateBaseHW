package com.mycourse.db_backend.admin;

import java.util.List;
import org.springframework.data.domain.Sort;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import com.mycourse.db_backend.auth.AdminOnly;
import com.mycourse.db_backend.common.Result;
import com.mycourse.db_backend.reservation.Reservation;
import com.mycourse.db_backend.reservation.ReservationRepository;
import com.mycourse.db_backend.reservation.ReservationService;
/**
 * 管理员预约控制器，负责接收前端请求并返回处理结果。
 */
@RestController
@AdminOnly
@RequestMapping("/api/admin/reservations")
public class AdminReservationController {
/**
 * 预约仓库，用来访问数据库。
 */
private final ReservationRepository reservationRepository;
/**
 * 预约服务，用来复用相关业务逻辑。
 */
private final ReservationService reservationService;
    /**
     * 查询reservations列表。
     */
@GetMapping
    public Result<List<Reservation>> listReservations() {
        return Result.success(reservationRepository.findAll(Sort.by(Sort.Direction.DESC, "createdAt")));
    }
    /**
     * 执行cancel相关处理。
     */
@PostMapping("/{reservationId}/cancel")
    public Result<Reservation> cancel(@PathVariable Long reservationId, @RequestBody(required = false) AdminCancelRequest request) {
        String reason = request == null ? "Cancelled by admin" : request.getReason();
        return Result.success("Cancelled successfully", reservationService.cancelReservation(reservationId, reason));
    }
/**
 * 管理员取消请求参数对象，用来封装接口入参。
 */
public static class AdminCancelRequest {
/**
 * 保存原因说明。
 */
private String reason;
/**
 * 构造AdminCancelRequest，并注入当前类运行所需的依赖对象。
 */
public AdminCancelRequest() {
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
            if (!(o instanceof AdminReservationController.AdminCancelRequest)) return false;
            final AdminReservationController.AdminCancelRequest other = (AdminReservationController.AdminCancelRequest) o;
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
            return other instanceof AdminReservationController.AdminCancelRequest;
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
            return "AdminReservationController.AdminCancelRequest(reason=" + this.getReason() + ")";
        }
    }
/**
 * 构造AdminReservationController，并注入当前类运行所需的依赖对象。
 */
public AdminReservationController(final ReservationRepository reservationRepository, final ReservationService reservationService) {
        this.reservationRepository = reservationRepository;
        this.reservationService = reservationService;
    }
}
