package com.mycourse.db_backend.billing;

import java.util.List;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import com.mycourse.db_backend.auth.AccessGuard;
import com.mycourse.db_backend.common.BusinessException;
import com.mycourse.db_backend.common.Result;
/**
 * 账单控制器，负责接收前端请求并返回处理结果。
 */
@RestController
@RequestMapping("/api/bills")
public class BillingController {
/**
 * 账单order仓库，用来访问数据库。
 */
private final BillingOrderRepository billingOrderRepository;
/**
 * 保存访问控制。
 */
private final AccessGuard accessGuard;
    /**
     * 获取by预约。
     */
@GetMapping("/reservation/{reservationId}")
    public Result<BillingOrder> getByReservation(@PathVariable Long reservationId) {
        BillingOrder bill = billingOrderRepository.findByReservationId(reservationId).orElseThrow(() -> new BusinessException("Bill does not exist"));
        accessGuard.requireSelfOrAdmin(bill.getUserId());
        return Result.success(bill);
    }
    /**
     * 查询by用户列表。
     */
@GetMapping("/user/{userId}")
    public Result<List<BillingOrder>> listByUser(@PathVariable Long userId) {
        accessGuard.requireSelfOrAdmin(userId);
        return Result.success(billingOrderRepository.findByUserIdOrderByCreatedAtDesc(userId));
    }
/**
 * 构造BillingController，并注入当前类运行所需的依赖对象。
 */
public BillingController(final BillingOrderRepository billingOrderRepository, final AccessGuard accessGuard) {
        this.billingOrderRepository = billingOrderRepository;
        this.accessGuard = accessGuard;
    }
}
