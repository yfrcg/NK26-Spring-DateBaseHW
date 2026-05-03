package com.mycourse.db_backend.account;

import java.util.List;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.mycourse.db_backend.auth.AccessGuard;
import com.mycourse.db_backend.common.Result;

import jakarta.validation.Valid;

/**
 * 账户相关接口控制器。
 * 提供账户查询、充值和流水查询能力。
 */
@RestController
@RequestMapping("/api/accounts")
public class AccountController {

    private final AccountService accountService;
    private final AccessGuard accessGuard;

    public AccountController(AccountService accountService, AccessGuard accessGuard) {
        this.accountService = accountService;
        this.accessGuard = accessGuard;
    }

    /**
     * 查询用户账户信息。
     * 普通用户只能查看自己的账户，管理员可以查看任意用户。
     *
     * @param userId 用户主键
     * @return 账户信息
     */
    @GetMapping("/{userId}")
    public Result<UserAccount> getAccount(@PathVariable Long userId) {
        accessGuard.requireSelfOrAdmin(userId);
        return Result.success(accountService.getOrCreateAccount(userId));
    }

    /**
     * 为用户账户充值。
     *
     * @param userId 用户主键
     * @param request 充值请求
     * @return 充值后的账户信息
     */
    @PostMapping("/{userId}/recharge")
    public Result<UserAccount> recharge(@PathVariable Long userId,
                                        @RequestBody @Valid RechargeRequest request) {
        accessGuard.requireSelfOrAdmin(userId);
        return Result.success("Recharge successful", accountService.recharge(userId, request.getAmount()));
    }

    /**
     * 查询用户账户流水。
     *
     * @param userId 用户主键
     * @return 流水列表
     */
    @GetMapping("/{userId}/transactions")
    public Result<List<AccountTransaction>> listTransactions(@PathVariable Long userId) {
        accessGuard.requireSelfOrAdmin(userId);
        return Result.success(accountService.listTransactions(userId));
    }
}
