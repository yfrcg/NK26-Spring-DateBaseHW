package com.mycourse.db_backend.admin;

import java.time.LocalDateTime;
import java.util.List;
import org.springframework.data.domain.Sort;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import com.mycourse.db_backend.auth.AdminOnly;
import com.mycourse.db_backend.common.BusinessException;
import com.mycourse.db_backend.common.Result;
import com.mycourse.db_backend.pricing.PricingPolicy;
import com.mycourse.db_backend.pricing.PricingPolicyRepository;
/**
 * 管理员计费控制器，负责接收前端请求并返回处理结果。
 */
@RestController
@AdminOnly
@RequestMapping("/api/admin/policies")
public class AdminPricingController {
/**
 * 计费策略仓库，用来访问数据库。
 */
private final PricingPolicyRepository pricingPolicyRepository;
    /**
     * 查询policies列表。
     */
@GetMapping
    public Result<List<PricingPolicy>> listPolicies() {
        return Result.success(pricingPolicyRepository.findAll(Sort.by(Sort.Direction.DESC, "createdAt")));
    }
    /**
     * 执行enable相关处理。
     */
@PostMapping("/{policyId}/enable")
    public Result<PricingPolicy> enable(@PathVariable Long policyId) {
        PricingPolicy policy = pricingPolicyRepository.findById(policyId).orElseThrow(() -> new BusinessException("Pricing policy does not exist"));
        policy.setIsActive(1);
        policy.setUpdatedAt(LocalDateTime.now());
        return Result.success("Enabled successfully", pricingPolicyRepository.save(policy));
    }
    /**
     * 执行disable相关处理。
     */
@PostMapping("/{policyId}/disable")
    public Result<PricingPolicy> disable(@PathVariable Long policyId) {
        PricingPolicy policy = pricingPolicyRepository.findById(policyId).orElseThrow(() -> new BusinessException("Pricing policy does not exist"));
        policy.setIsActive(0);
        policy.setUpdatedAt(LocalDateTime.now());
        return Result.success("Disabled successfully", pricingPolicyRepository.save(policy));
    }
/**
 * 构造AdminPricingController，并注入当前类运行所需的依赖对象。
 */
public AdminPricingController(final PricingPolicyRepository pricingPolicyRepository) {
        this.pricingPolicyRepository = pricingPolicyRepository;
    }
}
