package com.mycourse.db_backend.report;
/**
 * 热门空间视图对象，用来组织返回给前端的展示数据。
 */
public class TopSpaceVO {
/**
 * 保存空间ID。
 */
private Long spaceId;
/**
 * 保存空间名称。
 */
private String spaceName;
/**
 * 保存预约数量。
 */
private Long reservationCount;
/**
 * 构造TopSpaceVO，并注入当前类运行所需的依赖对象。
 */
public TopSpaceVO() {
    }
/**
 * 获取空间ID。
 */
public Long getSpaceId() {
        return this.spaceId;
    }
/**
 * 获取空间名称。
 */
public String getSpaceName() {
        return this.spaceName;
    }
/**
 * 获取预约数量。
 */
public Long getReservationCount() {
        return this.reservationCount;
    }
/**
 * 设置空间ID。
 */
public void setSpaceId(final Long spaceId) {
        this.spaceId = spaceId;
    }
/**
 * 设置空间名称。
 */
public void setSpaceName(final String spaceName) {
        this.spaceName = spaceName;
    }
/**
 * 设置预约数量。
 */
public void setReservationCount(final Long reservationCount) {
        this.reservationCount = reservationCount;
    }
    /**
     * 比较当前对象和另一个对象是否表示同一份业务数据。
     */
@java.lang.Override
    public boolean equals(final java.lang.Object o) {
        if (o == this) return true;
        if (!(o instanceof TopSpaceVO)) return false;
        final TopSpaceVO other = (TopSpaceVO) o;
        if (!other.canEqual((java.lang.Object) this)) return false;
        final java.lang.Object this$spaceId = this.getSpaceId();
        final java.lang.Object other$spaceId = other.getSpaceId();
        if (this$spaceId == null ? other$spaceId != null : !this$spaceId.equals(other$spaceId)) return false;
        final java.lang.Object this$reservationCount = this.getReservationCount();
        final java.lang.Object other$reservationCount = other.getReservationCount();
        if (this$reservationCount == null ? other$reservationCount != null : !this$reservationCount.equals(other$reservationCount)) return false;
        final java.lang.Object this$spaceName = this.getSpaceName();
        final java.lang.Object other$spaceName = other.getSpaceName();
        if (this$spaceName == null ? other$spaceName != null : !this$spaceName.equals(other$spaceName)) return false;
        return true;
    }
/**
 * 配合 equals 方法使用，避免继承场景下的比较错误。
 */
protected boolean canEqual(final java.lang.Object other) {
        return other instanceof TopSpaceVO;
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
        final java.lang.Object $reservationCount = this.getReservationCount();
        result = result * PRIME + ($reservationCount == null ? 43 : $reservationCount.hashCode());
        final java.lang.Object $spaceName = this.getSpaceName();
        result = result * PRIME + ($spaceName == null ? 43 : $spaceName.hashCode());
        return result;
    }
    /**
     * 把当前对象转换成便于调试查看的字符串。
     */
@java.lang.Override
    public java.lang.String toString() {
        return "TopSpaceVO(spaceId=" + this.getSpaceId() + ", spaceName=" + this.getSpaceName() + ", reservationCount=" + this.getReservationCount() + ")";
    }
}
