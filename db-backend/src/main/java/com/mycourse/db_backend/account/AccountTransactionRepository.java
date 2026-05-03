package com.mycourse.db_backend.account;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

/**
 * 账户流水仓库。
 */
public interface AccountTransactionRepository extends JpaRepository<AccountTransaction, Long> {

    /**
     * 按用户查询流水，按创建时间倒序返回。
     */
    List<AccountTransaction> findByAccountUserIdOrderByCreatedAtDesc(Long accountUserId);
}
