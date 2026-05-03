package com.mycourse.db_backend.account;

import java.math.BigDecimal;
import java.util.List;

/**
 * 账户领域服务接口。
 * 负责账户初始化、充值和账户流水查询等能力。
 */
public interface AccountService {

    /**
     * 查询指定用户的账户。
     * 如果账户还不存在，则自动创建一条初始记录。
     *
     * @param userId 用户主键
     * @return 用户账户
     */
    UserAccount getOrCreateAccount(Long userId);

    /**
     * 为指定用户充值。
     * 充值后系统会自动尝试结清历史未支付账单。
     *
     * @param userId 用户主键
     * @param amount 充值金额
     * @return 更新后的账户
     */
    UserAccount recharge(Long userId, BigDecimal amount);

    /**
     * 查询指定用户的账户流水。
     *
     * @param userId 用户主键
     * @return 流水列表
     */
    List<AccountTransaction> listTransactions(Long userId);
}
