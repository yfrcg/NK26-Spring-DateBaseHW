package com.mycourse.db_backend.pricing;

import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;
/**
 * 计费策略实体类，用来保存相关业务数据。
 */
@Entity
@Table(name = "pricing_policies")
public class PricingPolicy {
    /**
     * 保存计费策略ID。
     */
@Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "policy_id")
    private Long policyId;
    /**
     * 保存策略编码。
     */
@Column(name = "policy_code", nullable = false, unique = true)
    private String policyCode;
    /**
     * 保存策略名称。
     */
@Column(name = "policy_name", nullable = false, unique = true)
    private String policyName;
    /**
     * 保存charge模式。
     */
@Column(name = "charge_mode", nullable = false)
    private String chargeMode;
    /**
     * 保存每小时价格。
     */
@Column(name = "hourly_price", nullable = false)
    private BigDecimal hourlyPrice;
    /**
     * 保存免费分钟数。
     */
@Column(name = "free_minutes", nullable = false)
    private Integer freeMinutes;
    /**
     * 保存最大预约hours。
     */
@Column(name = "max_reserve_hours", nullable = false)
    private Integer maxReserveHours;
    /**
     * 保存押金金额。
     */
@Column(name = "deposit_amount", nullable = false)
    private BigDecimal depositAmount;
    /**
     * 保存超时价格倍率。
     */
@Column(name = "overtime_price_multiplier", nullable = false)
    private BigDecimal overtimePriceMultiplier;
    /**
     * 保存允许临时暂离。
     */
@Column(name = "allow_temp_hold", nullable = false)
    private Integer allowTempHold;
    /**
     * 保存临时暂离限制分钟数。
     */
@Column(name = "temp_hold_limit_minutes", nullable = false)
    private Integer tempHoldLimitMinutes;
    /**
     * 保存临时暂离最大数量。
     */
@Column(name = "temp_hold_max_count", nullable = false)
    private Integer tempHoldMaxCount;
    /**
     * 保存is启用。
     */
@Column(name = "is_active", nullable = false)
    private Integer isActive;
    /**
     * 保存有效from。
     */
@Column(name = "valid_from", nullable = false)
    private LocalDateTime validFrom;
    /**
     * 保存有效to。
     */
@Column(name = "valid_to")
    private LocalDateTime validTo;
    /**
     * 保存备注。
     */
@Column(name = "remarks")
    private String remarks;
    /**
     * 保存创建时间。
     */
@Column(name = "created_at", nullable = false)
    private LocalDateTime createdAt;
    /**
     * 保存更新时间。
     */
@Column(name = "updated_at", nullable = false)
    private LocalDateTime updatedAt;
    /**
     * 保存逻辑删除标记。
     */
@Column(name = "is_deleted", nullable = false)
    private Integer isDeleted;
/**
 * 构造PricingPolicy，并注入当前类运行所需的依赖对象。
 */
public PricingPolicy() {
    }
/**
 * 获取计费策略ID。
 */
public Long getPolicyId() {
        return this.policyId;
    }
/**
 * 获取策略编码。
 */
public String getPolicyCode() {
        return this.policyCode;
    }
/**
 * 获取策略名称。
 */
public String getPolicyName() {
        return this.policyName;
    }
/**
 * 获取charge模式。
 */
public String getChargeMode() {
        return this.chargeMode;
    }
/**
 * 获取每小时价格。
 */
public BigDecimal getHourlyPrice() {
        return this.hourlyPrice;
    }
/**
 * 获取免费分钟数。
 */
public Integer getFreeMinutes() {
        return this.freeMinutes;
    }
/**
 * 获取最大预约hours。
 */
public Integer getMaxReserveHours() {
        return this.maxReserveHours;
    }
/**
 * 获取押金金额。
 */
public BigDecimal getDepositAmount() {
        return this.depositAmount;
    }
/**
 * 获取超时价格倍率。
 */
public BigDecimal getOvertimePriceMultiplier() {
        return this.overtimePriceMultiplier;
    }
/**
 * 获取允许临时暂离。
 */
public Integer getAllowTempHold() {
        return this.allowTempHold;
    }
/**
 * 获取临时暂离限制分钟数。
 */
public Integer getTempHoldLimitMinutes() {
        return this.tempHoldLimitMinutes;
    }
/**
 * 获取临时暂离最大数量。
 */
public Integer getTempHoldMaxCount() {
        return this.tempHoldMaxCount;
    }
/**
 * 获取is启用。
 */
public Integer getIsActive() {
        return this.isActive;
    }
/**
 * 获取有效from。
 */
public LocalDateTime getValidFrom() {
        return this.validFrom;
    }
/**
 * 获取有效to。
 */
public LocalDateTime getValidTo() {
        return this.validTo;
    }
/**
 * 获取备注。
 */
public String getRemarks() {
        return this.remarks;
    }
/**
 * 获取创建时间。
 */
public LocalDateTime getCreatedAt() {
        return this.createdAt;
    }
/**
 * 获取更新时间。
 */
public LocalDateTime getUpdatedAt() {
        return this.updatedAt;
    }
/**
 * 获取逻辑删除标记。
 */
public Integer getIsDeleted() {
        return this.isDeleted;
    }
/**
 * 设置计费策略ID。
 */
public void setPolicyId(final Long policyId) {
        this.policyId = policyId;
    }
/**
 * 设置策略编码。
 */
public void setPolicyCode(final String policyCode) {
        this.policyCode = policyCode;
    }
/**
 * 设置策略名称。
 */
public void setPolicyName(final String policyName) {
        this.policyName = policyName;
    }
/**
 * 设置charge模式。
 */
public void setChargeMode(final String chargeMode) {
        this.chargeMode = chargeMode;
    }
/**
 * 设置每小时价格。
 */
public void setHourlyPrice(final BigDecimal hourlyPrice) {
        this.hourlyPrice = hourlyPrice;
    }
/**
 * 设置免费分钟数。
 */
public void setFreeMinutes(final Integer freeMinutes) {
        this.freeMinutes = freeMinutes;
    }
/**
 * 设置最大预约hours。
 */
public void setMaxReserveHours(final Integer maxReserveHours) {
        this.maxReserveHours = maxReserveHours;
    }
/**
 * 设置押金金额。
 */
public void setDepositAmount(final BigDecimal depositAmount) {
        this.depositAmount = depositAmount;
    }
/**
 * 设置超时价格倍率。
 */
public void setOvertimePriceMultiplier(final BigDecimal overtimePriceMultiplier) {
        this.overtimePriceMultiplier = overtimePriceMultiplier;
    }
/**
 * 设置允许临时暂离。
 */
public void setAllowTempHold(final Integer allowTempHold) {
        this.allowTempHold = allowTempHold;
    }
/**
 * 设置临时暂离限制分钟数。
 */
public void setTempHoldLimitMinutes(final Integer tempHoldLimitMinutes) {
        this.tempHoldLimitMinutes = tempHoldLimitMinutes;
    }
/**
 * 设置临时暂离最大数量。
 */
public void setTempHoldMaxCount(final Integer tempHoldMaxCount) {
        this.tempHoldMaxCount = tempHoldMaxCount;
    }
/**
 * 设置is启用。
 */
public void setIsActive(final Integer isActive) {
        this.isActive = isActive;
    }
/**
 * 设置有效from。
 */
public void setValidFrom(final LocalDateTime validFrom) {
        this.validFrom = validFrom;
    }
/**
 * 设置有效to。
 */
public void setValidTo(final LocalDateTime validTo) {
        this.validTo = validTo;
    }
/**
 * 设置备注。
 */
public void setRemarks(final String remarks) {
        this.remarks = remarks;
    }
/**
 * 设置创建时间。
 */
public void setCreatedAt(final LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }
/**
 * 设置更新时间。
 */
public void setUpdatedAt(final LocalDateTime updatedAt) {
        this.updatedAt = updatedAt;
    }
/**
 * 设置逻辑删除标记。
 */
public void setIsDeleted(final Integer isDeleted) {
        this.isDeleted = isDeleted;
    }
    /**
     * 比较当前对象和另一个对象是否表示同一份业务数据。
     */
@java.lang.Override
    public boolean equals(final java.lang.Object o) {
        if (o == this) return true;
        if (!(o instanceof PricingPolicy)) return false;
        final PricingPolicy other = (PricingPolicy) o;
        if (!other.canEqual((java.lang.Object) this)) return false;
        final java.lang.Object this$policyId = this.getPolicyId();
        final java.lang.Object other$policyId = other.getPolicyId();
        if (this$policyId == null ? other$policyId != null : !this$policyId.equals(other$policyId)) return false;
        final java.lang.Object this$freeMinutes = this.getFreeMinutes();
        final java.lang.Object other$freeMinutes = other.getFreeMinutes();
        if (this$freeMinutes == null ? other$freeMinutes != null : !this$freeMinutes.equals(other$freeMinutes)) return false;
        final java.lang.Object this$maxReserveHours = this.getMaxReserveHours();
        final java.lang.Object other$maxReserveHours = other.getMaxReserveHours();
        if (this$maxReserveHours == null ? other$maxReserveHours != null : !this$maxReserveHours.equals(other$maxReserveHours)) return false;
        final java.lang.Object this$allowTempHold = this.getAllowTempHold();
        final java.lang.Object other$allowTempHold = other.getAllowTempHold();
        if (this$allowTempHold == null ? other$allowTempHold != null : !this$allowTempHold.equals(other$allowTempHold)) return false;
        final java.lang.Object this$tempHoldLimitMinutes = this.getTempHoldLimitMinutes();
        final java.lang.Object other$tempHoldLimitMinutes = other.getTempHoldLimitMinutes();
        if (this$tempHoldLimitMinutes == null ? other$tempHoldLimitMinutes != null : !this$tempHoldLimitMinutes.equals(other$tempHoldLimitMinutes)) return false;
        final java.lang.Object this$tempHoldMaxCount = this.getTempHoldMaxCount();
        final java.lang.Object other$tempHoldMaxCount = other.getTempHoldMaxCount();
        if (this$tempHoldMaxCount == null ? other$tempHoldMaxCount != null : !this$tempHoldMaxCount.equals(other$tempHoldMaxCount)) return false;
        final java.lang.Object this$isActive = this.getIsActive();
        final java.lang.Object other$isActive = other.getIsActive();
        if (this$isActive == null ? other$isActive != null : !this$isActive.equals(other$isActive)) return false;
        final java.lang.Object this$isDeleted = this.getIsDeleted();
        final java.lang.Object other$isDeleted = other.getIsDeleted();
        if (this$isDeleted == null ? other$isDeleted != null : !this$isDeleted.equals(other$isDeleted)) return false;
        final java.lang.Object this$policyCode = this.getPolicyCode();
        final java.lang.Object other$policyCode = other.getPolicyCode();
        if (this$policyCode == null ? other$policyCode != null : !this$policyCode.equals(other$policyCode)) return false;
        final java.lang.Object this$policyName = this.getPolicyName();
        final java.lang.Object other$policyName = other.getPolicyName();
        if (this$policyName == null ? other$policyName != null : !this$policyName.equals(other$policyName)) return false;
        final java.lang.Object this$chargeMode = this.getChargeMode();
        final java.lang.Object other$chargeMode = other.getChargeMode();
        if (this$chargeMode == null ? other$chargeMode != null : !this$chargeMode.equals(other$chargeMode)) return false;
        final java.lang.Object this$hourlyPrice = this.getHourlyPrice();
        final java.lang.Object other$hourlyPrice = other.getHourlyPrice();
        if (this$hourlyPrice == null ? other$hourlyPrice != null : !this$hourlyPrice.equals(other$hourlyPrice)) return false;
        final java.lang.Object this$depositAmount = this.getDepositAmount();
        final java.lang.Object other$depositAmount = other.getDepositAmount();
        if (this$depositAmount == null ? other$depositAmount != null : !this$depositAmount.equals(other$depositAmount)) return false;
        final java.lang.Object this$overtimePriceMultiplier = this.getOvertimePriceMultiplier();
        final java.lang.Object other$overtimePriceMultiplier = other.getOvertimePriceMultiplier();
        if (this$overtimePriceMultiplier == null ? other$overtimePriceMultiplier != null : !this$overtimePriceMultiplier.equals(other$overtimePriceMultiplier)) return false;
        final java.lang.Object this$validFrom = this.getValidFrom();
        final java.lang.Object other$validFrom = other.getValidFrom();
        if (this$validFrom == null ? other$validFrom != null : !this$validFrom.equals(other$validFrom)) return false;
        final java.lang.Object this$validTo = this.getValidTo();
        final java.lang.Object other$validTo = other.getValidTo();
        if (this$validTo == null ? other$validTo != null : !this$validTo.equals(other$validTo)) return false;
        final java.lang.Object this$remarks = this.getRemarks();
        final java.lang.Object other$remarks = other.getRemarks();
        if (this$remarks == null ? other$remarks != null : !this$remarks.equals(other$remarks)) return false;
        final java.lang.Object this$createdAt = this.getCreatedAt();
        final java.lang.Object other$createdAt = other.getCreatedAt();
        if (this$createdAt == null ? other$createdAt != null : !this$createdAt.equals(other$createdAt)) return false;
        final java.lang.Object this$updatedAt = this.getUpdatedAt();
        final java.lang.Object other$updatedAt = other.getUpdatedAt();
        if (this$updatedAt == null ? other$updatedAt != null : !this$updatedAt.equals(other$updatedAt)) return false;
        return true;
    }
/**
 * 配合 equals 方法使用，避免继承场景下的比较错误。
 */
protected boolean canEqual(final java.lang.Object other) {
        return other instanceof PricingPolicy;
    }
    /**
     * 返回当前对象的哈希值，便于放入集合中使用。
     */
@java.lang.Override
    public int hashCode() {
        final int PRIME = 59;
        int result = 1;
        final java.lang.Object $policyId = this.getPolicyId();
        result = result * PRIME + ($policyId == null ? 43 : $policyId.hashCode());
        final java.lang.Object $freeMinutes = this.getFreeMinutes();
        result = result * PRIME + ($freeMinutes == null ? 43 : $freeMinutes.hashCode());
        final java.lang.Object $maxReserveHours = this.getMaxReserveHours();
        result = result * PRIME + ($maxReserveHours == null ? 43 : $maxReserveHours.hashCode());
        final java.lang.Object $allowTempHold = this.getAllowTempHold();
        result = result * PRIME + ($allowTempHold == null ? 43 : $allowTempHold.hashCode());
        final java.lang.Object $tempHoldLimitMinutes = this.getTempHoldLimitMinutes();
        result = result * PRIME + ($tempHoldLimitMinutes == null ? 43 : $tempHoldLimitMinutes.hashCode());
        final java.lang.Object $tempHoldMaxCount = this.getTempHoldMaxCount();
        result = result * PRIME + ($tempHoldMaxCount == null ? 43 : $tempHoldMaxCount.hashCode());
        final java.lang.Object $isActive = this.getIsActive();
        result = result * PRIME + ($isActive == null ? 43 : $isActive.hashCode());
        final java.lang.Object $isDeleted = this.getIsDeleted();
        result = result * PRIME + ($isDeleted == null ? 43 : $isDeleted.hashCode());
        final java.lang.Object $policyCode = this.getPolicyCode();
        result = result * PRIME + ($policyCode == null ? 43 : $policyCode.hashCode());
        final java.lang.Object $policyName = this.getPolicyName();
        result = result * PRIME + ($policyName == null ? 43 : $policyName.hashCode());
        final java.lang.Object $chargeMode = this.getChargeMode();
        result = result * PRIME + ($chargeMode == null ? 43 : $chargeMode.hashCode());
        final java.lang.Object $hourlyPrice = this.getHourlyPrice();
        result = result * PRIME + ($hourlyPrice == null ? 43 : $hourlyPrice.hashCode());
        final java.lang.Object $depositAmount = this.getDepositAmount();
        result = result * PRIME + ($depositAmount == null ? 43 : $depositAmount.hashCode());
        final java.lang.Object $overtimePriceMultiplier = this.getOvertimePriceMultiplier();
        result = result * PRIME + ($overtimePriceMultiplier == null ? 43 : $overtimePriceMultiplier.hashCode());
        final java.lang.Object $validFrom = this.getValidFrom();
        result = result * PRIME + ($validFrom == null ? 43 : $validFrom.hashCode());
        final java.lang.Object $validTo = this.getValidTo();
        result = result * PRIME + ($validTo == null ? 43 : $validTo.hashCode());
        final java.lang.Object $remarks = this.getRemarks();
        result = result * PRIME + ($remarks == null ? 43 : $remarks.hashCode());
        final java.lang.Object $createdAt = this.getCreatedAt();
        result = result * PRIME + ($createdAt == null ? 43 : $createdAt.hashCode());
        final java.lang.Object $updatedAt = this.getUpdatedAt();
        result = result * PRIME + ($updatedAt == null ? 43 : $updatedAt.hashCode());
        return result;
    }
    /**
     * 把当前对象转换成便于调试查看的字符串。
     */
@java.lang.Override
    public java.lang.String toString() {
        return "PricingPolicy(policyId=" + this.getPolicyId() + ", policyCode=" + this.getPolicyCode() + ", policyName=" + this.getPolicyName() + ", chargeMode=" + this.getChargeMode() + ", hourlyPrice=" + this.getHourlyPrice() + ", freeMinutes=" + this.getFreeMinutes() + ", maxReserveHours=" + this.getMaxReserveHours() + ", depositAmount=" + this.getDepositAmount() + ", overtimePriceMultiplier=" + this.getOvertimePriceMultiplier() + ", allowTempHold=" + this.getAllowTempHold() + ", tempHoldLimitMinutes=" + this.getTempHoldLimitMinutes() + ", tempHoldMaxCount=" + this.getTempHoldMaxCount() + ", isActive=" + this.getIsActive() + ", validFrom=" + this.getValidFrom() + ", validTo=" + this.getValidTo() + ", remarks=" + this.getRemarks() + ", createdAt=" + this.getCreatedAt() + ", updatedAt=" + this.getUpdatedAt() + ", isDeleted=" + this.getIsDeleted() + ")";
    }
}
