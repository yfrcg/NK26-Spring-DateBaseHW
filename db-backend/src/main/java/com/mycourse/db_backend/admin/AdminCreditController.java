package com.mycourse.db_backend.admin;

import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import com.mycourse.db_backend.auth.AccessGuard;
import com.mycourse.db_backend.auth.AdminOnly;
import com.mycourse.db_backend.common.Result;
import com.mycourse.db_backend.credit.CreditAdjustRequest;
import com.mycourse.db_backend.credit.CreditService;
import com.mycourse.db_backend.credit.CreditTransaction;
import jakarta.validation.Valid;
/**
 * 管理员信用控制器，负责接收前端请求并返回处理结果。
 */
@RestController
@AdminOnly
@RequestMapping("/api/admin/credits")
public class AdminCreditController {
/**
 * 信用服务，用来复用相关业务逻辑。
 */
private final CreditService creditService;
/**
 * 保存访问控制。
 */
private final AccessGuard accessGuard;
    /**
     * 执行adjust相关处理。
     */
@PostMapping("/{userId}/adjust")
    public Result<CreditTransaction> adjust(@PathVariable Long userId, @RequestBody @Valid CreditAdjustRequest request) {
        return Result.success("Adjusted successfully", creditService.manualAdjust(userId, request.getChangeScore(), request.getReason(), accessGuard.currentUser().userId()));
    }
/**
 * 构造AdminCreditController，并注入当前类运行所需的依赖对象。
 */
public AdminCreditController(final CreditService creditService, final AccessGuard accessGuard) {
        this.creditService = creditService;
        this.accessGuard = accessGuard;
    }
}
