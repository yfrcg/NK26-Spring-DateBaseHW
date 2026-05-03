package com.mycourse.db_backend.account;

import org.springframework.data.jpa.repository.JpaRepository;

/**
 * 用户账户仓库。
 */
public interface UserAccountRepository extends JpaRepository<UserAccount, Long> {
}
