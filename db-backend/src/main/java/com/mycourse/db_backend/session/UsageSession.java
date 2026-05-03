package com.mycourse.db_backend.session;

import java.time.LocalDateTime;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
/**
 * usage会话实体类，用来保存相关业务数据。
 */
@Entity
@Table(name = "usage_sessions")
public class UsageSession {
    /**
     * 保存使用会话ID。
     */
@Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "session_id")
    private Long sessionId;
    /**
     * 保存预约ID。
     */
@Column(name = "reservation_id", nullable = false, unique = true)
    private Long reservationId;
    /**
     * 保存签到时间。
     */
@Column(name = "check_in_time")
    private LocalDateTime checkInTime;
    /**
     * 保存签退时间。
     */
@Column(name = "check_out_time")
    private LocalDateTime checkOutTime;
    /**
     * 保存实际使用分钟数。
     */
@Column(name = "actual_minutes", nullable = false)
    private Integer actualMinutes;
    /**
     * 保存超时分钟数。
     */
@Column(name = "overtime_minutes", nullable = false)
    private Integer overtimeMinutes;
    /**
     * 保存暂离开始时间。
     */
@Column(name = "hold_start_time")
    private LocalDateTime holdStartTime;
    /**
     * 保存暂离过期时间。
     */
@Column(name = "hold_expire_time")
    private LocalDateTime holdExpireTime;
    /**
     * 保存暂离次数。
     */
@Column(name = "hold_count", nullable = false)
    private Integer holdCount;
    /**
     * 保存累计暂离分钟数。
     */
@Column(name = "total_hold_minutes", nullable = false)
    private Integer totalHoldMinutes;
    /**
     * 保存会话状态。
     */
@Column(name = "session_status", nullable = false)
    private String sessionStatus;
    /**
     * 保存操作人用户ID。
     */
@Column(name = "operator_user_id")
    private Long operatorUserId;
    /**
     * 保存notes。
     */
@Column(name = "notes")
    private String notes;
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
 * 构造UsageSession，并注入当前类运行所需的依赖对象。
 */
public UsageSession() {
    }
/**
 * 获取使用会话ID。
 */
public Long getSessionId() {
        return this.sessionId;
    }
/**
 * 获取预约ID。
 */
public Long getReservationId() {
        return this.reservationId;
    }
/**
 * 获取签到时间。
 */
public LocalDateTime getCheckInTime() {
        return this.checkInTime;
    }
/**
 * 获取签退时间。
 */
public LocalDateTime getCheckOutTime() {
        return this.checkOutTime;
    }
/**
 * 获取实际使用分钟数。
 */
public Integer getActualMinutes() {
        return this.actualMinutes;
    }
/**
 * 获取超时分钟数。
 */
public Integer getOvertimeMinutes() {
        return this.overtimeMinutes;
    }
/**
 * 获取暂离开始时间。
 */
public LocalDateTime getHoldStartTime() {
        return this.holdStartTime;
    }
/**
 * 获取暂离过期时间。
 */
public LocalDateTime getHoldExpireTime() {
        return this.holdExpireTime;
    }
/**
 * 获取暂离次数。
 */
public Integer getHoldCount() {
        return this.holdCount;
    }
/**
 * 获取累计暂离分钟数。
 */
public Integer getTotalHoldMinutes() {
        return this.totalHoldMinutes;
    }
/**
 * 获取会话状态。
 */
public String getSessionStatus() {
        return this.sessionStatus;
    }
/**
 * 获取操作人用户ID。
 */
public Long getOperatorUserId() {
        return this.operatorUserId;
    }
/**
 * 获取notes。
 */
public String getNotes() {
        return this.notes;
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
 * 设置使用会话ID。
 */
public void setSessionId(final Long sessionId) {
        this.sessionId = sessionId;
    }
/**
 * 设置预约ID。
 */
public void setReservationId(final Long reservationId) {
        this.reservationId = reservationId;
    }
/**
 * 设置签到时间。
 */
public void setCheckInTime(final LocalDateTime checkInTime) {
        this.checkInTime = checkInTime;
    }
/**
 * 设置签退时间。
 */
public void setCheckOutTime(final LocalDateTime checkOutTime) {
        this.checkOutTime = checkOutTime;
    }
/**
 * 设置实际使用分钟数。
 */
public void setActualMinutes(final Integer actualMinutes) {
        this.actualMinutes = actualMinutes;
    }
/**
 * 设置超时分钟数。
 */
public void setOvertimeMinutes(final Integer overtimeMinutes) {
        this.overtimeMinutes = overtimeMinutes;
    }
/**
 * 设置暂离开始时间。
 */
public void setHoldStartTime(final LocalDateTime holdStartTime) {
        this.holdStartTime = holdStartTime;
    }
/**
 * 设置暂离过期时间。
 */
public void setHoldExpireTime(final LocalDateTime holdExpireTime) {
        this.holdExpireTime = holdExpireTime;
    }
/**
 * 设置暂离次数。
 */
public void setHoldCount(final Integer holdCount) {
        this.holdCount = holdCount;
    }
/**
 * 设置累计暂离分钟数。
 */
public void setTotalHoldMinutes(final Integer totalHoldMinutes) {
        this.totalHoldMinutes = totalHoldMinutes;
    }
/**
 * 设置会话状态。
 */
public void setSessionStatus(final String sessionStatus) {
        this.sessionStatus = sessionStatus;
    }
/**
 * 设置操作人用户ID。
 */
public void setOperatorUserId(final Long operatorUserId) {
        this.operatorUserId = operatorUserId;
    }
/**
 * 设置notes。
 */
public void setNotes(final String notes) {
        this.notes = notes;
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
        if (!(o instanceof UsageSession)) return false;
        final UsageSession other = (UsageSession) o;
        if (!other.canEqual((java.lang.Object) this)) return false;
        final java.lang.Object this$sessionId = this.getSessionId();
        final java.lang.Object other$sessionId = other.getSessionId();
        if (this$sessionId == null ? other$sessionId != null : !this$sessionId.equals(other$sessionId)) return false;
        final java.lang.Object this$reservationId = this.getReservationId();
        final java.lang.Object other$reservationId = other.getReservationId();
        if (this$reservationId == null ? other$reservationId != null : !this$reservationId.equals(other$reservationId)) return false;
        final java.lang.Object this$actualMinutes = this.getActualMinutes();
        final java.lang.Object other$actualMinutes = other.getActualMinutes();
        if (this$actualMinutes == null ? other$actualMinutes != null : !this$actualMinutes.equals(other$actualMinutes)) return false;
        final java.lang.Object this$overtimeMinutes = this.getOvertimeMinutes();
        final java.lang.Object other$overtimeMinutes = other.getOvertimeMinutes();
        if (this$overtimeMinutes == null ? other$overtimeMinutes != null : !this$overtimeMinutes.equals(other$overtimeMinutes)) return false;
        final java.lang.Object this$holdCount = this.getHoldCount();
        final java.lang.Object other$holdCount = other.getHoldCount();
        if (this$holdCount == null ? other$holdCount != null : !this$holdCount.equals(other$holdCount)) return false;
        final java.lang.Object this$totalHoldMinutes = this.getTotalHoldMinutes();
        final java.lang.Object other$totalHoldMinutes = other.getTotalHoldMinutes();
        if (this$totalHoldMinutes == null ? other$totalHoldMinutes != null : !this$totalHoldMinutes.equals(other$totalHoldMinutes)) return false;
        final java.lang.Object this$operatorUserId = this.getOperatorUserId();
        final java.lang.Object other$operatorUserId = other.getOperatorUserId();
        if (this$operatorUserId == null ? other$operatorUserId != null : !this$operatorUserId.equals(other$operatorUserId)) return false;
        final java.lang.Object this$checkInTime = this.getCheckInTime();
        final java.lang.Object other$checkInTime = other.getCheckInTime();
        if (this$checkInTime == null ? other$checkInTime != null : !this$checkInTime.equals(other$checkInTime)) return false;
        final java.lang.Object this$checkOutTime = this.getCheckOutTime();
        final java.lang.Object other$checkOutTime = other.getCheckOutTime();
        if (this$checkOutTime == null ? other$checkOutTime != null : !this$checkOutTime.equals(other$checkOutTime)) return false;
        final java.lang.Object this$holdStartTime = this.getHoldStartTime();
        final java.lang.Object other$holdStartTime = other.getHoldStartTime();
        if (this$holdStartTime == null ? other$holdStartTime != null : !this$holdStartTime.equals(other$holdStartTime)) return false;
        final java.lang.Object this$holdExpireTime = this.getHoldExpireTime();
        final java.lang.Object other$holdExpireTime = other.getHoldExpireTime();
        if (this$holdExpireTime == null ? other$holdExpireTime != null : !this$holdExpireTime.equals(other$holdExpireTime)) return false;
        final java.lang.Object this$sessionStatus = this.getSessionStatus();
        final java.lang.Object other$sessionStatus = other.getSessionStatus();
        if (this$sessionStatus == null ? other$sessionStatus != null : !this$sessionStatus.equals(other$sessionStatus)) return false;
        final java.lang.Object this$notes = this.getNotes();
        final java.lang.Object other$notes = other.getNotes();
        if (this$notes == null ? other$notes != null : !this$notes.equals(other$notes)) return false;
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
        return other instanceof UsageSession;
    }
    /**
     * 返回当前对象的哈希值，便于放入集合中使用。
     */
@java.lang.Override
    public int hashCode() {
        final int PRIME = 59;
        int result = 1;
        final java.lang.Object $sessionId = this.getSessionId();
        result = result * PRIME + ($sessionId == null ? 43 : $sessionId.hashCode());
        final java.lang.Object $reservationId = this.getReservationId();
        result = result * PRIME + ($reservationId == null ? 43 : $reservationId.hashCode());
        final java.lang.Object $actualMinutes = this.getActualMinutes();
        result = result * PRIME + ($actualMinutes == null ? 43 : $actualMinutes.hashCode());
        final java.lang.Object $overtimeMinutes = this.getOvertimeMinutes();
        result = result * PRIME + ($overtimeMinutes == null ? 43 : $overtimeMinutes.hashCode());
        final java.lang.Object $holdCount = this.getHoldCount();
        result = result * PRIME + ($holdCount == null ? 43 : $holdCount.hashCode());
        final java.lang.Object $totalHoldMinutes = this.getTotalHoldMinutes();
        result = result * PRIME + ($totalHoldMinutes == null ? 43 : $totalHoldMinutes.hashCode());
        final java.lang.Object $operatorUserId = this.getOperatorUserId();
        result = result * PRIME + ($operatorUserId == null ? 43 : $operatorUserId.hashCode());
        final java.lang.Object $checkInTime = this.getCheckInTime();
        result = result * PRIME + ($checkInTime == null ? 43 : $checkInTime.hashCode());
        final java.lang.Object $checkOutTime = this.getCheckOutTime();
        result = result * PRIME + ($checkOutTime == null ? 43 : $checkOutTime.hashCode());
        final java.lang.Object $holdStartTime = this.getHoldStartTime();
        result = result * PRIME + ($holdStartTime == null ? 43 : $holdStartTime.hashCode());
        final java.lang.Object $holdExpireTime = this.getHoldExpireTime();
        result = result * PRIME + ($holdExpireTime == null ? 43 : $holdExpireTime.hashCode());
        final java.lang.Object $sessionStatus = this.getSessionStatus();
        result = result * PRIME + ($sessionStatus == null ? 43 : $sessionStatus.hashCode());
        final java.lang.Object $notes = this.getNotes();
        result = result * PRIME + ($notes == null ? 43 : $notes.hashCode());
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
        return "UsageSession(sessionId=" + this.getSessionId() + ", reservationId=" + this.getReservationId() + ", checkInTime=" + this.getCheckInTime() + ", checkOutTime=" + this.getCheckOutTime() + ", actualMinutes=" + this.getActualMinutes() + ", overtimeMinutes=" + this.getOvertimeMinutes() + ", holdStartTime=" + this.getHoldStartTime() + ", holdExpireTime=" + this.getHoldExpireTime() + ", holdCount=" + this.getHoldCount() + ", totalHoldMinutes=" + this.getTotalHoldMinutes() + ", sessionStatus=" + this.getSessionStatus() + ", operatorUserId=" + this.getOperatorUserId() + ", notes=" + this.getNotes() + ", createdAt=" + this.getCreatedAt() + ", updatedAt=" + this.getUpdatedAt() + ")";
    }
}
