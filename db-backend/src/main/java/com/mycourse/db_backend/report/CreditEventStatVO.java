package com.mycourse.db_backend.report;
/**
 * 信用事件stat视图对象，用来组织返回给前端的展示数据。
 */
public class CreditEventStatVO {
/**
 * 保存事件类型。
 */
private String eventType;
/**
 * 保存事件数量。
 */
private Long eventCount;
/**
 * 构造CreditEventStatVO，并注入当前类运行所需的依赖对象。
 */
public CreditEventStatVO() {
    }
/**
 * 获取事件类型。
 */
public String getEventType() {
        return this.eventType;
    }
/**
 * 获取事件数量。
 */
public Long getEventCount() {
        return this.eventCount;
    }
/**
 * 设置事件类型。
 */
public void setEventType(final String eventType) {
        this.eventType = eventType;
    }
/**
 * 设置事件数量。
 */
public void setEventCount(final Long eventCount) {
        this.eventCount = eventCount;
    }
    /**
     * 比较当前对象和另一个对象是否表示同一份业务数据。
     */
@java.lang.Override
    public boolean equals(final java.lang.Object o) {
        if (o == this) return true;
        if (!(o instanceof CreditEventStatVO)) return false;
        final CreditEventStatVO other = (CreditEventStatVO) o;
        if (!other.canEqual((java.lang.Object) this)) return false;
        final java.lang.Object this$eventCount = this.getEventCount();
        final java.lang.Object other$eventCount = other.getEventCount();
        if (this$eventCount == null ? other$eventCount != null : !this$eventCount.equals(other$eventCount)) return false;
        final java.lang.Object this$eventType = this.getEventType();
        final java.lang.Object other$eventType = other.getEventType();
        if (this$eventType == null ? other$eventType != null : !this$eventType.equals(other$eventType)) return false;
        return true;
    }
/**
 * 配合 equals 方法使用，避免继承场景下的比较错误。
 */
protected boolean canEqual(final java.lang.Object other) {
        return other instanceof CreditEventStatVO;
    }
    /**
     * 返回当前对象的哈希值，便于放入集合中使用。
     */
@java.lang.Override
    public int hashCode() {
        final int PRIME = 59;
        int result = 1;
        final java.lang.Object $eventCount = this.getEventCount();
        result = result * PRIME + ($eventCount == null ? 43 : $eventCount.hashCode());
        final java.lang.Object $eventType = this.getEventType();
        result = result * PRIME + ($eventType == null ? 43 : $eventType.hashCode());
        return result;
    }
    /**
     * 把当前对象转换成便于调试查看的字符串。
     */
@java.lang.Override
    public java.lang.String toString() {
        return "CreditEventStatVO(eventType=" + this.getEventType() + ", eventCount=" + this.getEventCount() + ")";
    }
}
