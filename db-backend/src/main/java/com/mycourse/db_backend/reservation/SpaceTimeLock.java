package com.mycourse.db_backend.reservation;

import java.time.LocalDateTime;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
/**
 * 空间时间lock实体类，用来保存相关业务数据。
 */
@Entity
@Table(name = "space_time_locks")
public class SpaceTimeLock {
    /**
     * 保存lockID。
     */
@Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "lock_id")
    private Long lockId;
    /**
     * 保存空间ID。
     */
@Column(name = "space_id", nullable = false)
    private Long spaceId;
    /**
     * 保存预约ID。
     */
@Column(name = "reservation_id", nullable = false)
    private Long reservationId;
    /**
     * 保存locksegmentno。
     */
@Column(name = "lock_segment_no", nullable = false)
    private Integer lockSegmentNo;
    /**
     * 保存lock类型。
     */
@Column(name = "lock_type", nullable = false)
    private String lockType;
    /**
     * 保存lock开始时间。
     */
@Column(name = "lock_start_time", nullable = false)
    private LocalDateTime lockStartTime;
    /**
     * 保存lock结束时间。
     */
@Column(name = "lock_end_time", nullable = false)
    private LocalDateTime lockEndTime;
    /**
     * 保存lock状态。
     */
@Column(name = "lock_status", nullable = false)
    private String lockStatus;
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
 * 构造SpaceTimeLock，并注入当前类运行所需的依赖对象。
 */
public SpaceTimeLock() {
    }
/**
 * 获取lockID。
 */
public Long getLockId() {
        return this.lockId;
    }
/**
 * 获取空间ID。
 */
public Long getSpaceId() {
        return this.spaceId;
    }
/**
 * 获取预约ID。
 */
public Long getReservationId() {
        return this.reservationId;
    }
/**
 * 获取locksegmentno。
 */
public Integer getLockSegmentNo() {
        return this.lockSegmentNo;
    }
/**
 * 获取lock类型。
 */
public String getLockType() {
        return this.lockType;
    }
/**
 * 获取lock开始时间。
 */
public LocalDateTime getLockStartTime() {
        return this.lockStartTime;
    }
/**
 * 获取lock结束时间。
 */
public LocalDateTime getLockEndTime() {
        return this.lockEndTime;
    }
/**
 * 获取lock状态。
 */
public String getLockStatus() {
        return this.lockStatus;
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
 * 设置lockID。
 */
public void setLockId(final Long lockId) {
        this.lockId = lockId;
    }
/**
 * 设置空间ID。
 */
public void setSpaceId(final Long spaceId) {
        this.spaceId = spaceId;
    }
/**
 * 设置预约ID。
 */
public void setReservationId(final Long reservationId) {
        this.reservationId = reservationId;
    }
/**
 * 设置locksegmentno。
 */
public void setLockSegmentNo(final Integer lockSegmentNo) {
        this.lockSegmentNo = lockSegmentNo;
    }
/**
 * 设置lock类型。
 */
public void setLockType(final String lockType) {
        this.lockType = lockType;
    }
/**
 * 设置lock开始时间。
 */
public void setLockStartTime(final LocalDateTime lockStartTime) {
        this.lockStartTime = lockStartTime;
    }
/**
 * 设置lock结束时间。
 */
public void setLockEndTime(final LocalDateTime lockEndTime) {
        this.lockEndTime = lockEndTime;
    }
/**
 * 设置lock状态。
 */
public void setLockStatus(final String lockStatus) {
        this.lockStatus = lockStatus;
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
        if (!(o instanceof SpaceTimeLock)) return false;
        final SpaceTimeLock other = (SpaceTimeLock) o;
        if (!other.canEqual((java.lang.Object) this)) return false;
        final java.lang.Object this$lockId = this.getLockId();
        final java.lang.Object other$lockId = other.getLockId();
        if (this$lockId == null ? other$lockId != null : !this$lockId.equals(other$lockId)) return false;
        final java.lang.Object this$spaceId = this.getSpaceId();
        final java.lang.Object other$spaceId = other.getSpaceId();
        if (this$spaceId == null ? other$spaceId != null : !this$spaceId.equals(other$spaceId)) return false;
        final java.lang.Object this$reservationId = this.getReservationId();
        final java.lang.Object other$reservationId = other.getReservationId();
        if (this$reservationId == null ? other$reservationId != null : !this$reservationId.equals(other$reservationId)) return false;
        final java.lang.Object this$lockSegmentNo = this.getLockSegmentNo();
        final java.lang.Object other$lockSegmentNo = other.getLockSegmentNo();
        if (this$lockSegmentNo == null ? other$lockSegmentNo != null : !this$lockSegmentNo.equals(other$lockSegmentNo)) return false;
        final java.lang.Object this$lockType = this.getLockType();
        final java.lang.Object other$lockType = other.getLockType();
        if (this$lockType == null ? other$lockType != null : !this$lockType.equals(other$lockType)) return false;
        final java.lang.Object this$lockStartTime = this.getLockStartTime();
        final java.lang.Object other$lockStartTime = other.getLockStartTime();
        if (this$lockStartTime == null ? other$lockStartTime != null : !this$lockStartTime.equals(other$lockStartTime)) return false;
        final java.lang.Object this$lockEndTime = this.getLockEndTime();
        final java.lang.Object other$lockEndTime = other.getLockEndTime();
        if (this$lockEndTime == null ? other$lockEndTime != null : !this$lockEndTime.equals(other$lockEndTime)) return false;
        final java.lang.Object this$lockStatus = this.getLockStatus();
        final java.lang.Object other$lockStatus = other.getLockStatus();
        if (this$lockStatus == null ? other$lockStatus != null : !this$lockStatus.equals(other$lockStatus)) return false;
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
        return other instanceof SpaceTimeLock;
    }
    /**
     * 返回当前对象的哈希值，便于放入集合中使用。
     */
@java.lang.Override
    public int hashCode() {
        final int PRIME = 59;
        int result = 1;
        final java.lang.Object $lockId = this.getLockId();
        result = result * PRIME + ($lockId == null ? 43 : $lockId.hashCode());
        final java.lang.Object $spaceId = this.getSpaceId();
        result = result * PRIME + ($spaceId == null ? 43 : $spaceId.hashCode());
        final java.lang.Object $reservationId = this.getReservationId();
        result = result * PRIME + ($reservationId == null ? 43 : $reservationId.hashCode());
        final java.lang.Object $lockSegmentNo = this.getLockSegmentNo();
        result = result * PRIME + ($lockSegmentNo == null ? 43 : $lockSegmentNo.hashCode());
        final java.lang.Object $lockType = this.getLockType();
        result = result * PRIME + ($lockType == null ? 43 : $lockType.hashCode());
        final java.lang.Object $lockStartTime = this.getLockStartTime();
        result = result * PRIME + ($lockStartTime == null ? 43 : $lockStartTime.hashCode());
        final java.lang.Object $lockEndTime = this.getLockEndTime();
        result = result * PRIME + ($lockEndTime == null ? 43 : $lockEndTime.hashCode());
        final java.lang.Object $lockStatus = this.getLockStatus();
        result = result * PRIME + ($lockStatus == null ? 43 : $lockStatus.hashCode());
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
        return "SpaceTimeLock(lockId=" + this.getLockId() + ", spaceId=" + this.getSpaceId() + ", reservationId=" + this.getReservationId() + ", lockSegmentNo=" + this.getLockSegmentNo() + ", lockType=" + this.getLockType() + ", lockStartTime=" + this.getLockStartTime() + ", lockEndTime=" + this.getLockEndTime() + ", lockStatus=" + this.getLockStatus() + ", createdAt=" + this.getCreatedAt() + ", updatedAt=" + this.getUpdatedAt() + ")";
    }
}
