package com.mycourse.db_backend.report;

import java.math.BigDecimal;
/**
 * 仪表盘视图对象，用来组织返回给前端的展示数据。
 */
public class DashboardVO {
/**
 * 保存今日预约数量。
 */
private Long todayReservationCount;
/**
 * 保存今日签到签到数量。
 */
private Long todayCheckInCount;
/**
 * 保存今日收入。
 */
private BigDecimal todayRevenue;
/**
 * 保存未支付bill数量。
 */
private Long unpaidBillCount;
/**
 * 保存启用用户数量。
 */
private Long activeUserCount;
/**
 * 构造DashboardVO，并注入当前类运行所需的依赖对象。
 */
public DashboardVO() {
    }
/**
 * 获取今日预约数量。
 */
public Long getTodayReservationCount() {
        return this.todayReservationCount;
    }
/**
 * 获取今日签到签到数量。
 */
public Long getTodayCheckInCount() {
        return this.todayCheckInCount;
    }
/**
 * 获取今日收入。
 */
public BigDecimal getTodayRevenue() {
        return this.todayRevenue;
    }
/**
 * 获取未支付bill数量。
 */
public Long getUnpaidBillCount() {
        return this.unpaidBillCount;
    }
/**
 * 获取启用用户数量。
 */
public Long getActiveUserCount() {
        return this.activeUserCount;
    }
/**
 * 设置今日预约数量。
 */
public void setTodayReservationCount(final Long todayReservationCount) {
        this.todayReservationCount = todayReservationCount;
    }
/**
 * 设置今日签到签到数量。
 */
public void setTodayCheckInCount(final Long todayCheckInCount) {
        this.todayCheckInCount = todayCheckInCount;
    }
/**
 * 设置今日收入。
 */
public void setTodayRevenue(final BigDecimal todayRevenue) {
        this.todayRevenue = todayRevenue;
    }
/**
 * 设置未支付bill数量。
 */
public void setUnpaidBillCount(final Long unpaidBillCount) {
        this.unpaidBillCount = unpaidBillCount;
    }
/**
 * 设置启用用户数量。
 */
public void setActiveUserCount(final Long activeUserCount) {
        this.activeUserCount = activeUserCount;
    }
    /**
     * 比较当前对象和另一个对象是否表示同一份业务数据。
     */
@java.lang.Override
    public boolean equals(final java.lang.Object o) {
        if (o == this) return true;
        if (!(o instanceof DashboardVO)) return false;
        final DashboardVO other = (DashboardVO) o;
        if (!other.canEqual((java.lang.Object) this)) return false;
        final java.lang.Object this$todayReservationCount = this.getTodayReservationCount();
        final java.lang.Object other$todayReservationCount = other.getTodayReservationCount();
        if (this$todayReservationCount == null ? other$todayReservationCount != null : !this$todayReservationCount.equals(other$todayReservationCount)) return false;
        final java.lang.Object this$todayCheckInCount = this.getTodayCheckInCount();
        final java.lang.Object other$todayCheckInCount = other.getTodayCheckInCount();
        if (this$todayCheckInCount == null ? other$todayCheckInCount != null : !this$todayCheckInCount.equals(other$todayCheckInCount)) return false;
        final java.lang.Object this$unpaidBillCount = this.getUnpaidBillCount();
        final java.lang.Object other$unpaidBillCount = other.getUnpaidBillCount();
        if (this$unpaidBillCount == null ? other$unpaidBillCount != null : !this$unpaidBillCount.equals(other$unpaidBillCount)) return false;
        final java.lang.Object this$activeUserCount = this.getActiveUserCount();
        final java.lang.Object other$activeUserCount = other.getActiveUserCount();
        if (this$activeUserCount == null ? other$activeUserCount != null : !this$activeUserCount.equals(other$activeUserCount)) return false;
        final java.lang.Object this$todayRevenue = this.getTodayRevenue();
        final java.lang.Object other$todayRevenue = other.getTodayRevenue();
        if (this$todayRevenue == null ? other$todayRevenue != null : !this$todayRevenue.equals(other$todayRevenue)) return false;
        return true;
    }
/**
 * 配合 equals 方法使用，避免继承场景下的比较错误。
 */
protected boolean canEqual(final java.lang.Object other) {
        return other instanceof DashboardVO;
    }
    /**
     * 返回当前对象的哈希值，便于放入集合中使用。
     */
@java.lang.Override
    public int hashCode() {
        final int PRIME = 59;
        int result = 1;
        final java.lang.Object $todayReservationCount = this.getTodayReservationCount();
        result = result * PRIME + ($todayReservationCount == null ? 43 : $todayReservationCount.hashCode());
        final java.lang.Object $todayCheckInCount = this.getTodayCheckInCount();
        result = result * PRIME + ($todayCheckInCount == null ? 43 : $todayCheckInCount.hashCode());
        final java.lang.Object $unpaidBillCount = this.getUnpaidBillCount();
        result = result * PRIME + ($unpaidBillCount == null ? 43 : $unpaidBillCount.hashCode());
        final java.lang.Object $activeUserCount = this.getActiveUserCount();
        result = result * PRIME + ($activeUserCount == null ? 43 : $activeUserCount.hashCode());
        final java.lang.Object $todayRevenue = this.getTodayRevenue();
        result = result * PRIME + ($todayRevenue == null ? 43 : $todayRevenue.hashCode());
        return result;
    }
    /**
     * 把当前对象转换成便于调试查看的字符串。
     */
@java.lang.Override
    public java.lang.String toString() {
        return "DashboardVO(todayReservationCount=" + this.getTodayReservationCount() + ", todayCheckInCount=" + this.getTodayCheckInCount() + ", todayRevenue=" + this.getTodayRevenue() + ", unpaidBillCount=" + this.getUnpaidBillCount() + ", activeUserCount=" + this.getActiveUserCount() + ")";
    }
}
