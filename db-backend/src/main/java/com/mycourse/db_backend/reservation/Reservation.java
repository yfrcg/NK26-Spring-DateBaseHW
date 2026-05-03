package com.mycourse.db_backend.reservation;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
/**
 * 预约实体类，用来保存相关业务数据。
 */
@Entity
@Table(name = "reservations")
public class Reservation {
    /**
     * 保存预约ID。
     */
@Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "reservation_id")
    private Long reservationId;
    /**
     * 保存预约编号。
     */
@Column(name = "reservation_no", nullable = false, unique = true)
    private String reservationNo;
    /**
     * 保存用户ID。
     */
@Column(name = "user_id", nullable = false)
    private Long userId;
    /**
     * 保存空间ID。
     */
@Column(name = "space_id", nullable = false)
    private Long spaceId;
    /**
     * 保存计费策略ID。
     */
@Column(name = "policy_id", nullable = false)
    private Long policyId;
    /**
     * 保存预约类型。
     */
@Column(name = "reservation_type", nullable = false)
    private String reservationType;
    /**
     * 保存开始时间。
     */
@Column(name = "start_time", nullable = false)
    private LocalDateTime startTime;
    /**
     * 保存结束时间。
     */
@Column(name = "end_time", nullable = false)
    private LocalDateTime endTime;
    /**
     * 保存预约状态。
     */
@Column(name = "reservation_status", nullable = false)
    private String reservationStatus;
    /**
     * 保存charge模式snapshot。
     */
@Column(name = "charge_mode_snapshot", nullable = false)
    private String chargeModeSnapshot;
    /**
     * 保存每小时价格snapshot。
     */
@Column(name = "hourly_price_snapshot", nullable = false)
    private BigDecimal hourlyPriceSnapshot;
    /**
     * 保存免费分钟数snapshot。
     */
@Column(name = "free_minutes_snapshot", nullable = false)
    private Integer freeMinutesSnapshot;
    /**
     * 保存最大预约hourssnapshot。
     */
@Column(name = "max_reserve_hours_snapshot", nullable = false)
    private Integer maxReserveHoursSnapshot;
    /**
     * 保存押金金额snapshot。
     */
@Column(name = "deposit_amount_snapshot", nullable = false)
    private BigDecimal depositAmountSnapshot;
    /**
     * 保存超时倍率snapshot。
     */
@Column(name = "overtime_multiplier_snapshot", nullable = false)
    private BigDecimal overtimeMultiplierSnapshot;
    /**
     * 保存预估金额。
     */
@Column(name = "amount_estimated", nullable = false)
    private BigDecimal amountEstimated;
    /**
     * 保存取消原因。
     */
@Column(name = "cancel_reason")
    private String cancelReason;
    /**
     * 保存取消时间。
     */
@Column(name = "cancel_time")
    private LocalDateTime cancelTime;
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
 * 构造Reservation，并注入当前类运行所需的依赖对象。
 */
public Reservation() {
    }
/**
 * 获取预约ID。
 */
public Long getReservationId() {
        return this.reservationId;
    }
/**
 * 获取预约编号。
 */
public String getReservationNo() {
        return this.reservationNo;
    }
/**
 * 获取用户ID。
 */
public Long getUserId() {
        return this.userId;
    }
/**
 * 获取空间ID。
 */
public Long getSpaceId() {
        return this.spaceId;
    }
/**
 * 获取计费策略ID。
 */
public Long getPolicyId() {
        return this.policyId;
    }
/**
 * 获取预约类型。
 */
public String getReservationType() {
        return this.reservationType;
    }
/**
 * 获取开始时间。
 */
public LocalDateTime getStartTime() {
        return this.startTime;
    }
/**
 * 获取结束时间。
 */
public LocalDateTime getEndTime() {
        return this.endTime;
    }
/**
 * 获取预约状态。
 */
public String getReservationStatus() {
        return this.reservationStatus;
    }
/**
 * 获取charge模式snapshot。
 */
public String getChargeModeSnapshot() {
        return this.chargeModeSnapshot;
    }
/**
 * 获取每小时价格snapshot。
 */
public BigDecimal getHourlyPriceSnapshot() {
        return this.hourlyPriceSnapshot;
    }
/**
 * 获取免费分钟数snapshot。
 */
public Integer getFreeMinutesSnapshot() {
        return this.freeMinutesSnapshot;
    }
/**
 * 获取最大预约hourssnapshot。
 */
public Integer getMaxReserveHoursSnapshot() {
        return this.maxReserveHoursSnapshot;
    }
/**
 * 获取押金金额snapshot。
 */
public BigDecimal getDepositAmountSnapshot() {
        return this.depositAmountSnapshot;
    }
/**
 * 获取超时倍率snapshot。
 */
public BigDecimal getOvertimeMultiplierSnapshot() {
        return this.overtimeMultiplierSnapshot;
    }
/**
 * 获取预估金额。
 */
public BigDecimal getAmountEstimated() {
        return this.amountEstimated;
    }
/**
 * 获取取消原因。
 */
public String getCancelReason() {
        return this.cancelReason;
    }
/**
 * 获取取消时间。
 */
public LocalDateTime getCancelTime() {
        return this.cancelTime;
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
 * 设置预约ID。
 */
public void setReservationId(final Long reservationId) {
        this.reservationId = reservationId;
    }
/**
 * 设置预约编号。
 */
public void setReservationNo(final String reservationNo) {
        this.reservationNo = reservationNo;
    }
/**
 * 设置用户ID。
 */
public void setUserId(final Long userId) {
        this.userId = userId;
    }
/**
 * 设置空间ID。
 */
public void setSpaceId(final Long spaceId) {
        this.spaceId = spaceId;
    }
/**
 * 设置计费策略ID。
 */
public void setPolicyId(final Long policyId) {
        this.policyId = policyId;
    }
/**
 * 设置预约类型。
 */
public void setReservationType(final String reservationType) {
        this.reservationType = reservationType;
    }
/**
 * 设置开始时间。
 */
public void setStartTime(final LocalDateTime startTime) {
        this.startTime = startTime;
    }
/**
 * 设置结束时间。
 */
public void setEndTime(final LocalDateTime endTime) {
        this.endTime = endTime;
    }
/**
 * 设置预约状态。
 */
public void setReservationStatus(final String reservationStatus) {
        this.reservationStatus = reservationStatus;
    }
/**
 * 设置charge模式snapshot。
 */
public void setChargeModeSnapshot(final String chargeModeSnapshot) {
        this.chargeModeSnapshot = chargeModeSnapshot;
    }
/**
 * 设置每小时价格snapshot。
 */
public void setHourlyPriceSnapshot(final BigDecimal hourlyPriceSnapshot) {
        this.hourlyPriceSnapshot = hourlyPriceSnapshot;
    }
/**
 * 设置免费分钟数snapshot。
 */
public void setFreeMinutesSnapshot(final Integer freeMinutesSnapshot) {
        this.freeMinutesSnapshot = freeMinutesSnapshot;
    }
/**
 * 设置最大预约hourssnapshot。
 */
public void setMaxReserveHoursSnapshot(final Integer maxReserveHoursSnapshot) {
        this.maxReserveHoursSnapshot = maxReserveHoursSnapshot;
    }
/**
 * 设置押金金额snapshot。
 */
public void setDepositAmountSnapshot(final BigDecimal depositAmountSnapshot) {
        this.depositAmountSnapshot = depositAmountSnapshot;
    }
/**
 * 设置超时倍率snapshot。
 */
public void setOvertimeMultiplierSnapshot(final BigDecimal overtimeMultiplierSnapshot) {
        this.overtimeMultiplierSnapshot = overtimeMultiplierSnapshot;
    }
/**
 * 设置预估金额。
 */
public void setAmountEstimated(final BigDecimal amountEstimated) {
        this.amountEstimated = amountEstimated;
    }
/**
 * 设置取消原因。
 */
public void setCancelReason(final String cancelReason) {
        this.cancelReason = cancelReason;
    }
/**
 * 设置取消时间。
 */
public void setCancelTime(final LocalDateTime cancelTime) {
        this.cancelTime = cancelTime;
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
        if (!(o instanceof Reservation)) return false;
        final Reservation other = (Reservation) o;
        if (!other.canEqual((java.lang.Object) this)) return false;
        final java.lang.Object this$reservationId = this.getReservationId();
        final java.lang.Object other$reservationId = other.getReservationId();
        if (this$reservationId == null ? other$reservationId != null : !this$reservationId.equals(other$reservationId)) return false;
        final java.lang.Object this$userId = this.getUserId();
        final java.lang.Object other$userId = other.getUserId();
        if (this$userId == null ? other$userId != null : !this$userId.equals(other$userId)) return false;
        final java.lang.Object this$spaceId = this.getSpaceId();
        final java.lang.Object other$spaceId = other.getSpaceId();
        if (this$spaceId == null ? other$spaceId != null : !this$spaceId.equals(other$spaceId)) return false;
        final java.lang.Object this$policyId = this.getPolicyId();
        final java.lang.Object other$policyId = other.getPolicyId();
        if (this$policyId == null ? other$policyId != null : !this$policyId.equals(other$policyId)) return false;
        final java.lang.Object this$freeMinutesSnapshot = this.getFreeMinutesSnapshot();
        final java.lang.Object other$freeMinutesSnapshot = other.getFreeMinutesSnapshot();
        if (this$freeMinutesSnapshot == null ? other$freeMinutesSnapshot != null : !this$freeMinutesSnapshot.equals(other$freeMinutesSnapshot)) return false;
        final java.lang.Object this$maxReserveHoursSnapshot = this.getMaxReserveHoursSnapshot();
        final java.lang.Object other$maxReserveHoursSnapshot = other.getMaxReserveHoursSnapshot();
        if (this$maxReserveHoursSnapshot == null ? other$maxReserveHoursSnapshot != null : !this$maxReserveHoursSnapshot.equals(other$maxReserveHoursSnapshot)) return false;
        final java.lang.Object this$reservationNo = this.getReservationNo();
        final java.lang.Object other$reservationNo = other.getReservationNo();
        if (this$reservationNo == null ? other$reservationNo != null : !this$reservationNo.equals(other$reservationNo)) return false;
        final java.lang.Object this$reservationType = this.getReservationType();
        final java.lang.Object other$reservationType = other.getReservationType();
        if (this$reservationType == null ? other$reservationType != null : !this$reservationType.equals(other$reservationType)) return false;
        final java.lang.Object this$startTime = this.getStartTime();
        final java.lang.Object other$startTime = other.getStartTime();
        if (this$startTime == null ? other$startTime != null : !this$startTime.equals(other$startTime)) return false;
        final java.lang.Object this$endTime = this.getEndTime();
        final java.lang.Object other$endTime = other.getEndTime();
        if (this$endTime == null ? other$endTime != null : !this$endTime.equals(other$endTime)) return false;
        final java.lang.Object this$reservationStatus = this.getReservationStatus();
        final java.lang.Object other$reservationStatus = other.getReservationStatus();
        if (this$reservationStatus == null ? other$reservationStatus != null : !this$reservationStatus.equals(other$reservationStatus)) return false;
        final java.lang.Object this$chargeModeSnapshot = this.getChargeModeSnapshot();
        final java.lang.Object other$chargeModeSnapshot = other.getChargeModeSnapshot();
        if (this$chargeModeSnapshot == null ? other$chargeModeSnapshot != null : !this$chargeModeSnapshot.equals(other$chargeModeSnapshot)) return false;
        final java.lang.Object this$hourlyPriceSnapshot = this.getHourlyPriceSnapshot();
        final java.lang.Object other$hourlyPriceSnapshot = other.getHourlyPriceSnapshot();
        if (this$hourlyPriceSnapshot == null ? other$hourlyPriceSnapshot != null : !this$hourlyPriceSnapshot.equals(other$hourlyPriceSnapshot)) return false;
        final java.lang.Object this$depositAmountSnapshot = this.getDepositAmountSnapshot();
        final java.lang.Object other$depositAmountSnapshot = other.getDepositAmountSnapshot();
        if (this$depositAmountSnapshot == null ? other$depositAmountSnapshot != null : !this$depositAmountSnapshot.equals(other$depositAmountSnapshot)) return false;
        final java.lang.Object this$overtimeMultiplierSnapshot = this.getOvertimeMultiplierSnapshot();
        final java.lang.Object other$overtimeMultiplierSnapshot = other.getOvertimeMultiplierSnapshot();
        if (this$overtimeMultiplierSnapshot == null ? other$overtimeMultiplierSnapshot != null : !this$overtimeMultiplierSnapshot.equals(other$overtimeMultiplierSnapshot)) return false;
        final java.lang.Object this$amountEstimated = this.getAmountEstimated();
        final java.lang.Object other$amountEstimated = other.getAmountEstimated();
        if (this$amountEstimated == null ? other$amountEstimated != null : !this$amountEstimated.equals(other$amountEstimated)) return false;
        final java.lang.Object this$cancelReason = this.getCancelReason();
        final java.lang.Object other$cancelReason = other.getCancelReason();
        if (this$cancelReason == null ? other$cancelReason != null : !this$cancelReason.equals(other$cancelReason)) return false;
        final java.lang.Object this$cancelTime = this.getCancelTime();
        final java.lang.Object other$cancelTime = other.getCancelTime();
        if (this$cancelTime == null ? other$cancelTime != null : !this$cancelTime.equals(other$cancelTime)) return false;
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
        return other instanceof Reservation;
    }
    /**
     * 返回当前对象的哈希值，便于放入集合中使用。
     */
@java.lang.Override
    public int hashCode() {
        final int PRIME = 59;
        int result = 1;
        final java.lang.Object $reservationId = this.getReservationId();
        result = result * PRIME + ($reservationId == null ? 43 : $reservationId.hashCode());
        final java.lang.Object $userId = this.getUserId();
        result = result * PRIME + ($userId == null ? 43 : $userId.hashCode());
        final java.lang.Object $spaceId = this.getSpaceId();
        result = result * PRIME + ($spaceId == null ? 43 : $spaceId.hashCode());
        final java.lang.Object $policyId = this.getPolicyId();
        result = result * PRIME + ($policyId == null ? 43 : $policyId.hashCode());
        final java.lang.Object $freeMinutesSnapshot = this.getFreeMinutesSnapshot();
        result = result * PRIME + ($freeMinutesSnapshot == null ? 43 : $freeMinutesSnapshot.hashCode());
        final java.lang.Object $maxReserveHoursSnapshot = this.getMaxReserveHoursSnapshot();
        result = result * PRIME + ($maxReserveHoursSnapshot == null ? 43 : $maxReserveHoursSnapshot.hashCode());
        final java.lang.Object $reservationNo = this.getReservationNo();
        result = result * PRIME + ($reservationNo == null ? 43 : $reservationNo.hashCode());
        final java.lang.Object $reservationType = this.getReservationType();
        result = result * PRIME + ($reservationType == null ? 43 : $reservationType.hashCode());
        final java.lang.Object $startTime = this.getStartTime();
        result = result * PRIME + ($startTime == null ? 43 : $startTime.hashCode());
        final java.lang.Object $endTime = this.getEndTime();
        result = result * PRIME + ($endTime == null ? 43 : $endTime.hashCode());
        final java.lang.Object $reservationStatus = this.getReservationStatus();
        result = result * PRIME + ($reservationStatus == null ? 43 : $reservationStatus.hashCode());
        final java.lang.Object $chargeModeSnapshot = this.getChargeModeSnapshot();
        result = result * PRIME + ($chargeModeSnapshot == null ? 43 : $chargeModeSnapshot.hashCode());
        final java.lang.Object $hourlyPriceSnapshot = this.getHourlyPriceSnapshot();
        result = result * PRIME + ($hourlyPriceSnapshot == null ? 43 : $hourlyPriceSnapshot.hashCode());
        final java.lang.Object $depositAmountSnapshot = this.getDepositAmountSnapshot();
        result = result * PRIME + ($depositAmountSnapshot == null ? 43 : $depositAmountSnapshot.hashCode());
        final java.lang.Object $overtimeMultiplierSnapshot = this.getOvertimeMultiplierSnapshot();
        result = result * PRIME + ($overtimeMultiplierSnapshot == null ? 43 : $overtimeMultiplierSnapshot.hashCode());
        final java.lang.Object $amountEstimated = this.getAmountEstimated();
        result = result * PRIME + ($amountEstimated == null ? 43 : $amountEstimated.hashCode());
        final java.lang.Object $cancelReason = this.getCancelReason();
        result = result * PRIME + ($cancelReason == null ? 43 : $cancelReason.hashCode());
        final java.lang.Object $cancelTime = this.getCancelTime();
        result = result * PRIME + ($cancelTime == null ? 43 : $cancelTime.hashCode());
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
        return "Reservation(reservationId=" + this.getReservationId() + ", reservationNo=" + this.getReservationNo() + ", userId=" + this.getUserId() + ", spaceId=" + this.getSpaceId() + ", policyId=" + this.getPolicyId() + ", reservationType=" + this.getReservationType() + ", startTime=" + this.getStartTime() + ", endTime=" + this.getEndTime() + ", reservationStatus=" + this.getReservationStatus() + ", chargeModeSnapshot=" + this.getChargeModeSnapshot() + ", hourlyPriceSnapshot=" + this.getHourlyPriceSnapshot() + ", freeMinutesSnapshot=" + this.getFreeMinutesSnapshot() + ", maxReserveHoursSnapshot=" + this.getMaxReserveHoursSnapshot() + ", depositAmountSnapshot=" + this.getDepositAmountSnapshot() + ", overtimeMultiplierSnapshot=" + this.getOvertimeMultiplierSnapshot() + ", amountEstimated=" + this.getAmountEstimated() + ", cancelReason=" + this.getCancelReason() + ", cancelTime=" + this.getCancelTime() + ", createdAt=" + this.getCreatedAt() + ", updatedAt=" + this.getUpdatedAt() + ")";
    }
}
