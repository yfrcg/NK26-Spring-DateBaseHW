package com.mycourse.db_backend.billing;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
/**
 * 账单order实体类，用来保存相关业务数据。
 */
@Entity
@Table(name = "billing_orders")
public class BillingOrder {
    /**
     * 保存账单ID。
     */
@Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "bill_id")
    private Long billId;
    /**
     * 保存账单编号。
     */
@Column(name = "bill_no", nullable = false, unique = true)
    private String billNo;
    /**
     * 保存预约ID。
     */
@Column(name = "reservation_id", nullable = false, unique = true)
    private Long reservationId;
    /**
     * 保存用户ID。
     */
@Column(name = "user_id", nullable = false)
    private Long userId;
    /**
     * 保存bill状态。
     */
@Column(name = "bill_status", nullable = false)
    private String billStatus;
    /**
     * 保存base金额。
     */
@Column(name = "base_amount", nullable = false)
    private BigDecimal baseAmount;
    /**
     * 保存超时金额。
     */
@Column(name = "overtime_amount", nullable = false)
    private BigDecimal overtimeAmount;
    /**
     * 保存discount金额。
     */
@Column(name = "discount_amount", nullable = false)
    private BigDecimal discountAmount;
    /**
     * 保存payable金额。
     */
@Column(name = "payable_amount", nullable = false)
    private BigDecimal payableAmount;
    /**
     * 保存paid金额。
     */
@Column(name = "paid_amount", nullable = false)
    private BigDecimal paidAmount;
    /**
     * 保存settledat。
     */
@Column(name = "settled_at")
    private LocalDateTime settledAt;
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
 * 构造BillingOrder，并注入当前类运行所需的依赖对象。
 */
public BillingOrder() {
    }
/**
 * 获取账单ID。
 */
public Long getBillId() {
        return this.billId;
    }
/**
 * 获取账单编号。
 */
public String getBillNo() {
        return this.billNo;
    }
/**
 * 获取预约ID。
 */
public Long getReservationId() {
        return this.reservationId;
    }
/**
 * 获取用户ID。
 */
public Long getUserId() {
        return this.userId;
    }
/**
 * 获取bill状态。
 */
public String getBillStatus() {
        return this.billStatus;
    }
/**
 * 获取base金额。
 */
public BigDecimal getBaseAmount() {
        return this.baseAmount;
    }
/**
 * 获取超时金额。
 */
public BigDecimal getOvertimeAmount() {
        return this.overtimeAmount;
    }
/**
 * 获取discount金额。
 */
public BigDecimal getDiscountAmount() {
        return this.discountAmount;
    }
/**
 * 获取payable金额。
 */
public BigDecimal getPayableAmount() {
        return this.payableAmount;
    }
/**
 * 获取paid金额。
 */
public BigDecimal getPaidAmount() {
        return this.paidAmount;
    }
/**
 * 获取settledat。
 */
public LocalDateTime getSettledAt() {
        return this.settledAt;
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
 * 设置账单ID。
 */
public void setBillId(final Long billId) {
        this.billId = billId;
    }
/**
 * 设置账单编号。
 */
public void setBillNo(final String billNo) {
        this.billNo = billNo;
    }
/**
 * 设置预约ID。
 */
public void setReservationId(final Long reservationId) {
        this.reservationId = reservationId;
    }
/**
 * 设置用户ID。
 */
public void setUserId(final Long userId) {
        this.userId = userId;
    }
/**
 * 设置bill状态。
 */
public void setBillStatus(final String billStatus) {
        this.billStatus = billStatus;
    }
/**
 * 设置base金额。
 */
public void setBaseAmount(final BigDecimal baseAmount) {
        this.baseAmount = baseAmount;
    }
/**
 * 设置超时金额。
 */
public void setOvertimeAmount(final BigDecimal overtimeAmount) {
        this.overtimeAmount = overtimeAmount;
    }
/**
 * 设置discount金额。
 */
public void setDiscountAmount(final BigDecimal discountAmount) {
        this.discountAmount = discountAmount;
    }
/**
 * 设置payable金额。
 */
public void setPayableAmount(final BigDecimal payableAmount) {
        this.payableAmount = payableAmount;
    }
/**
 * 设置paid金额。
 */
public void setPaidAmount(final BigDecimal paidAmount) {
        this.paidAmount = paidAmount;
    }
/**
 * 设置settledat。
 */
public void setSettledAt(final LocalDateTime settledAt) {
        this.settledAt = settledAt;
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
     * 比较当前对象和另一个对象是否表示同一份业务数据。
     */
@java.lang.Override
    public boolean equals(final java.lang.Object o) {
        if (o == this) return true;
        if (!(o instanceof BillingOrder)) return false;
        final BillingOrder other = (BillingOrder) o;
        if (!other.canEqual((java.lang.Object) this)) return false;
        final java.lang.Object this$billId = this.getBillId();
        final java.lang.Object other$billId = other.getBillId();
        if (this$billId == null ? other$billId != null : !this$billId.equals(other$billId)) return false;
        final java.lang.Object this$reservationId = this.getReservationId();
        final java.lang.Object other$reservationId = other.getReservationId();
        if (this$reservationId == null ? other$reservationId != null : !this$reservationId.equals(other$reservationId)) return false;
        final java.lang.Object this$userId = this.getUserId();
        final java.lang.Object other$userId = other.getUserId();
        if (this$userId == null ? other$userId != null : !this$userId.equals(other$userId)) return false;
        final java.lang.Object this$billNo = this.getBillNo();
        final java.lang.Object other$billNo = other.getBillNo();
        if (this$billNo == null ? other$billNo != null : !this$billNo.equals(other$billNo)) return false;
        final java.lang.Object this$billStatus = this.getBillStatus();
        final java.lang.Object other$billStatus = other.getBillStatus();
        if (this$billStatus == null ? other$billStatus != null : !this$billStatus.equals(other$billStatus)) return false;
        final java.lang.Object this$baseAmount = this.getBaseAmount();
        final java.lang.Object other$baseAmount = other.getBaseAmount();
        if (this$baseAmount == null ? other$baseAmount != null : !this$baseAmount.equals(other$baseAmount)) return false;
        final java.lang.Object this$overtimeAmount = this.getOvertimeAmount();
        final java.lang.Object other$overtimeAmount = other.getOvertimeAmount();
        if (this$overtimeAmount == null ? other$overtimeAmount != null : !this$overtimeAmount.equals(other$overtimeAmount)) return false;
        final java.lang.Object this$discountAmount = this.getDiscountAmount();
        final java.lang.Object other$discountAmount = other.getDiscountAmount();
        if (this$discountAmount == null ? other$discountAmount != null : !this$discountAmount.equals(other$discountAmount)) return false;
        final java.lang.Object this$payableAmount = this.getPayableAmount();
        final java.lang.Object other$payableAmount = other.getPayableAmount();
        if (this$payableAmount == null ? other$payableAmount != null : !this$payableAmount.equals(other$payableAmount)) return false;
        final java.lang.Object this$paidAmount = this.getPaidAmount();
        final java.lang.Object other$paidAmount = other.getPaidAmount();
        if (this$paidAmount == null ? other$paidAmount != null : !this$paidAmount.equals(other$paidAmount)) return false;
        final java.lang.Object this$settledAt = this.getSettledAt();
        final java.lang.Object other$settledAt = other.getSettledAt();
        if (this$settledAt == null ? other$settledAt != null : !this$settledAt.equals(other$settledAt)) return false;
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
        return other instanceof BillingOrder;
    }
    /**
     * 返回当前对象的哈希值，便于放入集合中使用。
     */
@java.lang.Override
    public int hashCode() {
        final int PRIME = 59;
        int result = 1;
        final java.lang.Object $billId = this.getBillId();
        result = result * PRIME + ($billId == null ? 43 : $billId.hashCode());
        final java.lang.Object $reservationId = this.getReservationId();
        result = result * PRIME + ($reservationId == null ? 43 : $reservationId.hashCode());
        final java.lang.Object $userId = this.getUserId();
        result = result * PRIME + ($userId == null ? 43 : $userId.hashCode());
        final java.lang.Object $billNo = this.getBillNo();
        result = result * PRIME + ($billNo == null ? 43 : $billNo.hashCode());
        final java.lang.Object $billStatus = this.getBillStatus();
        result = result * PRIME + ($billStatus == null ? 43 : $billStatus.hashCode());
        final java.lang.Object $baseAmount = this.getBaseAmount();
        result = result * PRIME + ($baseAmount == null ? 43 : $baseAmount.hashCode());
        final java.lang.Object $overtimeAmount = this.getOvertimeAmount();
        result = result * PRIME + ($overtimeAmount == null ? 43 : $overtimeAmount.hashCode());
        final java.lang.Object $discountAmount = this.getDiscountAmount();
        result = result * PRIME + ($discountAmount == null ? 43 : $discountAmount.hashCode());
        final java.lang.Object $payableAmount = this.getPayableAmount();
        result = result * PRIME + ($payableAmount == null ? 43 : $payableAmount.hashCode());
        final java.lang.Object $paidAmount = this.getPaidAmount();
        result = result * PRIME + ($paidAmount == null ? 43 : $paidAmount.hashCode());
        final java.lang.Object $settledAt = this.getSettledAt();
        result = result * PRIME + ($settledAt == null ? 43 : $settledAt.hashCode());
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
        return "BillingOrder(billId=" + this.getBillId() + ", billNo=" + this.getBillNo() + ", reservationId=" + this.getReservationId() + ", userId=" + this.getUserId() + ", billStatus=" + this.getBillStatus() + ", baseAmount=" + this.getBaseAmount() + ", overtimeAmount=" + this.getOvertimeAmount() + ", discountAmount=" + this.getDiscountAmount() + ", payableAmount=" + this.getPayableAmount() + ", paidAmount=" + this.getPaidAmount() + ", settledAt=" + this.getSettledAt() + ", remarks=" + this.getRemarks() + ", createdAt=" + this.getCreatedAt() + ", updatedAt=" + this.getUpdatedAt() + ")";
    }
}
