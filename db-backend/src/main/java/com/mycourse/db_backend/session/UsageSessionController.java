package com.mycourse.db_backend.session;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import com.mycourse.db_backend.auth.AccessGuard;
import com.mycourse.db_backend.common.BusinessException;
import com.mycourse.db_backend.common.Result;
import com.mycourse.db_backend.reservation.Reservation;
import com.mycourse.db_backend.reservation.ReservationRepository;
/**
 * usage会话控制器，负责接收前端请求并返回处理结果。
 */
@RestController
@RequestMapping("/api/sessions")
public class UsageSessionController {
/**
 * usage会话服务，用来复用相关业务逻辑。
 */
private final UsageSessionService usageSessionService;
/**
 * 预约仓库，用来访问数据库。
 */
private final ReservationRepository reservationRepository;
/**
 * 保存访问控制。
 */
private final AccessGuard accessGuard;
    /**
     * 为预约执行签到并开启使用会话。
     */
@PostMapping("/{reservationId}/check-in")
    public Result<UsageSession> checkIn(@PathVariable Long reservationId) {
        authorizeReservationAccess(reservationId);
        return Result.success("Check-in successful", usageSessionService.checkIn(reservationId));
    }
    /**
     * 把当前使用中的会话切换为暂离状态。
     */
@PostMapping("/{reservationId}/temp-hold")
    public Result<UsageSession> tempHold(@PathVariable Long reservationId) {
        authorizeReservationAccess(reservationId);
        return Result.success("Temporary hold successful", usageSessionService.tempHold(reservationId));
    }
    /**
     * 从暂离状态恢复继续使用。
     */
@PostMapping("/{reservationId}/resume")
    public Result<UsageSession> resume(@PathVariable Long reservationId) {
        authorizeReservationAccess(reservationId);
        return Result.success("Session resumed", usageSessionService.resume(reservationId));
    }
    /**
     * 执行签退并完成费用结算。
     */
@PostMapping("/{reservationId}/check-out")
    public Result<UsageSession> checkOut(@PathVariable Long reservationId) {
        authorizeReservationAccess(reservationId);
        return Result.success("Check-out successful", usageSessionService.checkOut(reservationId));
    }
    /**
     * 获取by预约ID。
     */
@GetMapping("/reservation/{reservationId}")
    public Result<UsageSession> getByReservationId(@PathVariable Long reservationId) {
        authorizeReservationAccess(reservationId);
        return Result.success(usageSessionService.getByReservationId(reservationId));
    }
/**
 * 执行authorizeReservationAccess相关处理。
 */
private void authorizeReservationAccess(Long reservationId) {
        Reservation reservation = reservationRepository.findById(reservationId).orElseThrow(() -> new BusinessException("Reservation does not exist"));
        accessGuard.requireSelfOrAdmin(reservation.getUserId());
    }
/**
 * 构造UsageSessionController，并注入当前类运行所需的依赖对象。
 */
public UsageSessionController(final UsageSessionService usageSessionService, final ReservationRepository reservationRepository, final AccessGuard accessGuard) {
        this.usageSessionService = usageSessionService;
        this.reservationRepository = reservationRepository;
        this.accessGuard = accessGuard;
    }
}
