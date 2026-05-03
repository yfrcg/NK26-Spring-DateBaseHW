package com.mycourse.db_backend.credit;

import java.util.List;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import com.mycourse.db_backend.auth.AccessGuard;
import com.mycourse.db_backend.auth.AdminOnly;
import com.mycourse.db_backend.common.Result;
import jakarta.validation.Valid;
/**
 * 信用控制器，负责接收前端请求并返回处理结果。
 */
@RestController
@RequestMapping("/api/credits")
public class CreditController {
/**
 * 信用服务，用来复用相关业务逻辑。
 */
private final CreditService creditService;
/**
 * 保存访问控制。
 */
private final AccessGuard accessGuard;
    /**
     * 查询by用户列表。
     */
@GetMapping("/{userId}/records")
    public Result<List<CreditTransaction>> listByUser(@PathVariable Long userId) {
        accessGuard.requireSelfOrAdmin(userId);
        return Result.success(creditService.listByUserId(userId));
    }
    /**
     * 执行manualAdjust相关处理。
     */
@AdminOnly
    @PostMapping("/{userId}/adjust")
    public Result<CreditTransaction> manualAdjust(@PathVariable Long userId, @RequestBody @Valid CreditAdjustRequest request) {
        return Result.success("Adjusted successfully", creditService.manualAdjust(userId, request.getChangeScore(), request.getReason(), accessGuard.currentUser().userId()));
    }
/**
 * 构造CreditController，并注入当前类运行所需的依赖对象。
 */
public CreditController(final CreditService creditService, final AccessGuard accessGuard) {
        this.creditService = creditService;
        this.accessGuard = accessGuard;
    }
}
