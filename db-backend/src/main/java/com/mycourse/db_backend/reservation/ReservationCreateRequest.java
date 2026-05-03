package com.mycourse.db_backend.reservation;

import java.time.LocalDateTime;
import jakarta.validation.constraints.NotNull;
/**
 * 预约创建请求参数对象，用来封装接口入参。
 */
public class ReservationCreateRequest {
    /**
     * 保存用户ID。
     */
@NotNull(message = "用户ID不能为空")
    private Long userId;
    /**
     * 保存空间ID。
     */
@NotNull(message = "空间ID不能为空")
    private Long spaceId;
    /**
     * 保存开始时间。
     */
@NotNull(message = "开始时间不能为空")
    private LocalDateTime startTime;
    /**
     * 保存结束时间。
     */
@NotNull(message = "结束时间不能为空")
    private LocalDateTime endTime;
/**
 * 构造ReservationCreateRequest，并注入当前类运行所需的依赖对象。
 */
public ReservationCreateRequest() {
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
     * 比较当前对象和另一个对象是否表示同一份业务数据。
     */
@java.lang.Override
    public boolean equals(final java.lang.Object o) {
        if (o == this) return true;
        if (!(o instanceof ReservationCreateRequest)) return false;
        final ReservationCreateRequest other = (ReservationCreateRequest) o;
        if (!other.canEqual((java.lang.Object) this)) return false;
        final java.lang.Object this$userId = this.getUserId();
        final java.lang.Object other$userId = other.getUserId();
        if (this$userId == null ? other$userId != null : !this$userId.equals(other$userId)) return false;
        final java.lang.Object this$spaceId = this.getSpaceId();
        final java.lang.Object other$spaceId = other.getSpaceId();
        if (this$spaceId == null ? other$spaceId != null : !this$spaceId.equals(other$spaceId)) return false;
        final java.lang.Object this$startTime = this.getStartTime();
        final java.lang.Object other$startTime = other.getStartTime();
        if (this$startTime == null ? other$startTime != null : !this$startTime.equals(other$startTime)) return false;
        final java.lang.Object this$endTime = this.getEndTime();
        final java.lang.Object other$endTime = other.getEndTime();
        if (this$endTime == null ? other$endTime != null : !this$endTime.equals(other$endTime)) return false;
        return true;
    }
/**
 * 配合 equals 方法使用，避免继承场景下的比较错误。
 */
protected boolean canEqual(final java.lang.Object other) {
        return other instanceof ReservationCreateRequest;
    }
    /**
     * 返回当前对象的哈希值，便于放入集合中使用。
     */
@java.lang.Override
    public int hashCode() {
        final int PRIME = 59;
        int result = 1;
        final java.lang.Object $userId = this.getUserId();
        result = result * PRIME + ($userId == null ? 43 : $userId.hashCode());
        final java.lang.Object $spaceId = this.getSpaceId();
        result = result * PRIME + ($spaceId == null ? 43 : $spaceId.hashCode());
        final java.lang.Object $startTime = this.getStartTime();
        result = result * PRIME + ($startTime == null ? 43 : $startTime.hashCode());
        final java.lang.Object $endTime = this.getEndTime();
        result = result * PRIME + ($endTime == null ? 43 : $endTime.hashCode());
        return result;
    }
    /**
     * 把当前对象转换成便于调试查看的字符串。
     */
@java.lang.Override
    public java.lang.String toString() {
        return "ReservationCreateRequest(userId=" + this.getUserId() + ", spaceId=" + this.getSpaceId() + ", startTime=" + this.getStartTime() + ", endTime=" + this.getEndTime() + ")";
    }
}
