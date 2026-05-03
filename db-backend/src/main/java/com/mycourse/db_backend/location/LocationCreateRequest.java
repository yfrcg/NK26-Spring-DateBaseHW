package com.mycourse.db_backend.location;

import java.time.LocalTime;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
/**
 * 位置创建请求参数对象，用来封装接口入参。
 */
public class LocationCreateRequest {
/**
 * 保存父级位置ID。
 */
private Long parentLocationId;
    /**
     * 保存位置编码。
     */
@NotBlank(message = "场地编码不能为空")
    private String locationCode;
    /**
     * 保存位置名称。
     */
@NotBlank(message = "场地名称不能为空")
    private String locationName;
    /**
     * 保存位置类型。
     */
@NotBlank(message = "场地类型不能为空")
    private String locationType;
/**
 * 保存楼层no。
 */
private String floorNo;
/**
 * 保存房间no。
 */
private String roomNo;
    /**
     * 保存开放时间。
     */
@NotNull(message = "开放时间不能为空")
    private LocalTime openTime;
    /**
     * 保存关闭时间。
     */
@NotNull(message = "关闭时间不能为空")
    private LocalTime closeTime;
/**
 * 保存备注。
 */
private String remarks;
/**
 * 构造LocationCreateRequest，并注入当前类运行所需的依赖对象。
 */
public LocationCreateRequest() {
    }
/**
 * 获取父级位置ID。
 */
public Long getParentLocationId() {
        return this.parentLocationId;
    }
/**
 * 获取位置编码。
 */
public String getLocationCode() {
        return this.locationCode;
    }
/**
 * 获取位置名称。
 */
public String getLocationName() {
        return this.locationName;
    }
/**
 * 获取位置类型。
 */
public String getLocationType() {
        return this.locationType;
    }
/**
 * 获取楼层no。
 */
public String getFloorNo() {
        return this.floorNo;
    }
/**
 * 获取房间no。
 */
public String getRoomNo() {
        return this.roomNo;
    }
/**
 * 获取开放时间。
 */
public LocalTime getOpenTime() {
        return this.openTime;
    }
/**
 * 获取关闭时间。
 */
public LocalTime getCloseTime() {
        return this.closeTime;
    }
/**
 * 获取备注。
 */
public String getRemarks() {
        return this.remarks;
    }
/**
 * 设置父级位置ID。
 */
public void setParentLocationId(final Long parentLocationId) {
        this.parentLocationId = parentLocationId;
    }
/**
 * 设置位置编码。
 */
public void setLocationCode(final String locationCode) {
        this.locationCode = locationCode;
    }
/**
 * 设置位置名称。
 */
public void setLocationName(final String locationName) {
        this.locationName = locationName;
    }
/**
 * 设置位置类型。
 */
public void setLocationType(final String locationType) {
        this.locationType = locationType;
    }
/**
 * 设置楼层no。
 */
public void setFloorNo(final String floorNo) {
        this.floorNo = floorNo;
    }
/**
 * 设置房间no。
 */
public void setRoomNo(final String roomNo) {
        this.roomNo = roomNo;
    }
/**
 * 设置开放时间。
 */
public void setOpenTime(final LocalTime openTime) {
        this.openTime = openTime;
    }
/**
 * 设置关闭时间。
 */
public void setCloseTime(final LocalTime closeTime) {
        this.closeTime = closeTime;
    }
/**
 * 设置备注。
 */
public void setRemarks(final String remarks) {
        this.remarks = remarks;
    }
    /**
     * 比较当前对象和另一个对象是否表示同一份业务数据。
     */
@java.lang.Override
    public boolean equals(final java.lang.Object o) {
        if (o == this) return true;
        if (!(o instanceof LocationCreateRequest)) return false;
        final LocationCreateRequest other = (LocationCreateRequest) o;
        if (!other.canEqual((java.lang.Object) this)) return false;
        final java.lang.Object this$parentLocationId = this.getParentLocationId();
        final java.lang.Object other$parentLocationId = other.getParentLocationId();
        if (this$parentLocationId == null ? other$parentLocationId != null : !this$parentLocationId.equals(other$parentLocationId)) return false;
        final java.lang.Object this$locationCode = this.getLocationCode();
        final java.lang.Object other$locationCode = other.getLocationCode();
        if (this$locationCode == null ? other$locationCode != null : !this$locationCode.equals(other$locationCode)) return false;
        final java.lang.Object this$locationName = this.getLocationName();
        final java.lang.Object other$locationName = other.getLocationName();
        if (this$locationName == null ? other$locationName != null : !this$locationName.equals(other$locationName)) return false;
        final java.lang.Object this$locationType = this.getLocationType();
        final java.lang.Object other$locationType = other.getLocationType();
        if (this$locationType == null ? other$locationType != null : !this$locationType.equals(other$locationType)) return false;
        final java.lang.Object this$floorNo = this.getFloorNo();
        final java.lang.Object other$floorNo = other.getFloorNo();
        if (this$floorNo == null ? other$floorNo != null : !this$floorNo.equals(other$floorNo)) return false;
        final java.lang.Object this$roomNo = this.getRoomNo();
        final java.lang.Object other$roomNo = other.getRoomNo();
        if (this$roomNo == null ? other$roomNo != null : !this$roomNo.equals(other$roomNo)) return false;
        final java.lang.Object this$openTime = this.getOpenTime();
        final java.lang.Object other$openTime = other.getOpenTime();
        if (this$openTime == null ? other$openTime != null : !this$openTime.equals(other$openTime)) return false;
        final java.lang.Object this$closeTime = this.getCloseTime();
        final java.lang.Object other$closeTime = other.getCloseTime();
        if (this$closeTime == null ? other$closeTime != null : !this$closeTime.equals(other$closeTime)) return false;
        final java.lang.Object this$remarks = this.getRemarks();
        final java.lang.Object other$remarks = other.getRemarks();
        if (this$remarks == null ? other$remarks != null : !this$remarks.equals(other$remarks)) return false;
        return true;
    }
/**
 * 配合 equals 方法使用，避免继承场景下的比较错误。
 */
protected boolean canEqual(final java.lang.Object other) {
        return other instanceof LocationCreateRequest;
    }
    /**
     * 返回当前对象的哈希值，便于放入集合中使用。
     */
@java.lang.Override
    public int hashCode() {
        final int PRIME = 59;
        int result = 1;
        final java.lang.Object $parentLocationId = this.getParentLocationId();
        result = result * PRIME + ($parentLocationId == null ? 43 : $parentLocationId.hashCode());
        final java.lang.Object $locationCode = this.getLocationCode();
        result = result * PRIME + ($locationCode == null ? 43 : $locationCode.hashCode());
        final java.lang.Object $locationName = this.getLocationName();
        result = result * PRIME + ($locationName == null ? 43 : $locationName.hashCode());
        final java.lang.Object $locationType = this.getLocationType();
        result = result * PRIME + ($locationType == null ? 43 : $locationType.hashCode());
        final java.lang.Object $floorNo = this.getFloorNo();
        result = result * PRIME + ($floorNo == null ? 43 : $floorNo.hashCode());
        final java.lang.Object $roomNo = this.getRoomNo();
        result = result * PRIME + ($roomNo == null ? 43 : $roomNo.hashCode());
        final java.lang.Object $openTime = this.getOpenTime();
        result = result * PRIME + ($openTime == null ? 43 : $openTime.hashCode());
        final java.lang.Object $closeTime = this.getCloseTime();
        result = result * PRIME + ($closeTime == null ? 43 : $closeTime.hashCode());
        final java.lang.Object $remarks = this.getRemarks();
        result = result * PRIME + ($remarks == null ? 43 : $remarks.hashCode());
        return result;
    }
    /**
     * 把当前对象转换成便于调试查看的字符串。
     */
@java.lang.Override
    public java.lang.String toString() {
        return "LocationCreateRequest(parentLocationId=" + this.getParentLocationId() + ", locationCode=" + this.getLocationCode() + ", locationName=" + this.getLocationName() + ", locationType=" + this.getLocationType() + ", floorNo=" + this.getFloorNo() + ", roomNo=" + this.getRoomNo() + ", openTime=" + this.getOpenTime() + ", closeTime=" + this.getCloseTime() + ", remarks=" + this.getRemarks() + ")";
    }
}
