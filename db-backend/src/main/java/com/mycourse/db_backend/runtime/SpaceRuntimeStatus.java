package com.mycourse.db_backend.runtime;

import java.time.LocalDateTime;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
/**
 * 空间运行状态实体类，用来保存相关业务数据。
 */
@Entity
@Table(name = "space_runtime_status")
public class SpaceRuntimeStatus {
    /**
     * 保存空间ID。
     */
@Id
    @Column(name = "space_id")
    private Long spaceId;
    /**
     * 保存当前状态。
     */
@Column(name = "current_status", nullable = false)
    private String currentStatus;
    /**
     * 保存当前关联预约ID。
     */
@Column(name = "current_reservation_id")
    private Long currentReservationId;
    /**
     * 保存当前关联会话ID。
     */
@Column(name = "current_session_id")
    private Long currentSessionId;
    /**
     * 保存当前状态开始时间。
     */
@Column(name = "status_since")
    private LocalDateTime statusSince;
    /**
     * 保存暂离过期时间。
     */
@Column(name = "hold_expire_time")
    private LocalDateTime holdExpireTime;
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
 * 构造SpaceRuntimeStatus，并注入当前类运行所需的依赖对象。
 */
public SpaceRuntimeStatus() {
    }
/**
 * 获取空间ID。
 */
public Long getSpaceId() {
        return this.spaceId;
    }
/**
 * 获取当前状态。
 */
public String getCurrentStatus() {
        return this.currentStatus;
    }
/**
 * 获取当前关联预约ID。
 */
public Long getCurrentReservationId() {
        return this.currentReservationId;
    }
/**
 * 获取当前关联会话ID。
 */
public Long getCurrentSessionId() {
        return this.currentSessionId;
    }
/**
 * 获取当前状态开始时间。
 */
public LocalDateTime getStatusSince() {
        return this.statusSince;
    }
/**
 * 获取暂离过期时间。
 */
public LocalDateTime getHoldExpireTime() {
        return this.holdExpireTime;
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
 * 设置空间ID。
 */
public void setSpaceId(final Long spaceId) {
        this.spaceId = spaceId;
    }
/**
 * 设置当前状态。
 */
public void setCurrentStatus(final String currentStatus) {
        this.currentStatus = currentStatus;
    }
/**
 * 设置当前关联预约ID。
 */
public void setCurrentReservationId(final Long currentReservationId) {
        this.currentReservationId = currentReservationId;
    }
/**
 * 设置当前关联会话ID。
 */
public void setCurrentSessionId(final Long currentSessionId) {
        this.currentSessionId = currentSessionId;
    }
/**
 * 设置当前状态开始时间。
 */
public void setStatusSince(final LocalDateTime statusSince) {
        this.statusSince = statusSince;
    }
/**
 * 设置暂离过期时间。
 */
public void setHoldExpireTime(final LocalDateTime holdExpireTime) {
        this.holdExpireTime = holdExpireTime;
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
        if (!(o instanceof SpaceRuntimeStatus)) return false;
        final SpaceRuntimeStatus other = (SpaceRuntimeStatus) o;
        if (!other.canEqual((java.lang.Object) this)) return false;
        final java.lang.Object this$spaceId = this.getSpaceId();
        final java.lang.Object other$spaceId = other.getSpaceId();
        if (this$spaceId == null ? other$spaceId != null : !this$spaceId.equals(other$spaceId)) return false;
        final java.lang.Object this$currentReservationId = this.getCurrentReservationId();
        final java.lang.Object other$currentReservationId = other.getCurrentReservationId();
        if (this$currentReservationId == null ? other$currentReservationId != null : !this$currentReservationId.equals(other$currentReservationId)) return false;
        final java.lang.Object this$currentSessionId = this.getCurrentSessionId();
        final java.lang.Object other$currentSessionId = other.getCurrentSessionId();
        if (this$currentSessionId == null ? other$currentSessionId != null : !this$currentSessionId.equals(other$currentSessionId)) return false;
        final java.lang.Object this$currentStatus = this.getCurrentStatus();
        final java.lang.Object other$currentStatus = other.getCurrentStatus();
        if (this$currentStatus == null ? other$currentStatus != null : !this$currentStatus.equals(other$currentStatus)) return false;
        final java.lang.Object this$statusSince = this.getStatusSince();
        final java.lang.Object other$statusSince = other.getStatusSince();
        if (this$statusSince == null ? other$statusSince != null : !this$statusSince.equals(other$statusSince)) return false;
        final java.lang.Object this$holdExpireTime = this.getHoldExpireTime();
        final java.lang.Object other$holdExpireTime = other.getHoldExpireTime();
        if (this$holdExpireTime == null ? other$holdExpireTime != null : !this$holdExpireTime.equals(other$holdExpireTime)) return false;
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
        return other instanceof SpaceRuntimeStatus;
    }
    /**
     * 返回当前对象的哈希值，便于放入集合中使用。
     */
@java.lang.Override
    public int hashCode() {
        final int PRIME = 59;
        int result = 1;
        final java.lang.Object $spaceId = this.getSpaceId();
        result = result * PRIME + ($spaceId == null ? 43 : $spaceId.hashCode());
        final java.lang.Object $currentReservationId = this.getCurrentReservationId();
        result = result * PRIME + ($currentReservationId == null ? 43 : $currentReservationId.hashCode());
        final java.lang.Object $currentSessionId = this.getCurrentSessionId();
        result = result * PRIME + ($currentSessionId == null ? 43 : $currentSessionId.hashCode());
        final java.lang.Object $currentStatus = this.getCurrentStatus();
        result = result * PRIME + ($currentStatus == null ? 43 : $currentStatus.hashCode());
        final java.lang.Object $statusSince = this.getStatusSince();
        result = result * PRIME + ($statusSince == null ? 43 : $statusSince.hashCode());
        final java.lang.Object $holdExpireTime = this.getHoldExpireTime();
        result = result * PRIME + ($holdExpireTime == null ? 43 : $holdExpireTime.hashCode());
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
        return "SpaceRuntimeStatus(spaceId=" + this.getSpaceId() + ", currentStatus=" + this.getCurrentStatus() + ", currentReservationId=" + this.getCurrentReservationId() + ", currentSessionId=" + this.getCurrentSessionId() + ", statusSince=" + this.getStatusSince() + ", holdExpireTime=" + this.getHoldExpireTime() + ", createdAt=" + this.getCreatedAt() + ", updatedAt=" + this.getUpdatedAt() + ")";
    }
}
