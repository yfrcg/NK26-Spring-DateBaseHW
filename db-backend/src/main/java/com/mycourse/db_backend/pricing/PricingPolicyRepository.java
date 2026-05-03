package com.mycourse.db_backend.pricing;

import org.springframework.data.jpa.repository.JpaRepository;
/**
 * 计费策略仓库接口，负责访问数据库中的相关数据。
 */
public interface PricingPolicyRepository extends JpaRepository<PricingPolicy, Long> {
}
