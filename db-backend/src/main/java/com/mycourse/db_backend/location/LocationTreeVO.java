package com.mycourse.db_backend.location;

import java.util.ArrayList;
import java.util.List;
/**
 * 位置树视图对象，用来组织返回给前端的展示数据。
 */
public class LocationTreeVO {
/**
 * 保存位置ID。
 */
private Long locationId;
/**
 * 保存父级位置ID。
 */
private Long parentLocationId;
/**
 * 保存位置编码。
 */
private String locationCode;
/**
 * 保存位置名称。
 */
private String locationName;
/**
 * 保存位置类型。
 */
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
 * 保存状态。
 */
private String status;
    private List<LocationTreeVO> children = new ArrayList<>();
/**
 * 构造LocationTreeVO，并注入当前类运行所需的依赖对象。
 */
public LocationTreeVO() {
    }
/**
 * 获取位置ID。
 */
public Long getLocationId() {
        return this.locationId;
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
 * 获取状态。
 */
public String getStatus() {
        return this.status;
    }
/**
 * 获取子节点。
 */
public List<LocationTreeVO> getChildren() {
        return this.children;
    }
/**
 * 设置位置ID。
 */
public void setLocationId(final Long locationId) {
        this.locationId = locationId;
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
 * 设置状态。
 */
public void setStatus(final String status) {
        this.status = status;
    }
/**
 * 设置子节点。
 */
public void setChildren(final List<LocationTreeVO> children) {
        this.children = children;
    }
    /**
     * 比较当前对象和另一个对象是否表示同一份业务数据。
     */
@java.lang.Override
    public boolean equals(final java.lang.Object o) {
        if (o == this) return true;
        if (!(o instanceof LocationTreeVO)) return false;
        final LocationTreeVO other = (LocationTreeVO) o;
        if (!other.canEqual((java.lang.Object) this)) return false;
        final java.lang.Object this$locationId = this.getLocationId();
        final java.lang.Object other$locationId = other.getLocationId();
        if (this$locationId == null ? other$locationId != null : !this$locationId.equals(other$locationId)) return false;
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
        final java.lang.Object this$status = this.getStatus();
        final java.lang.Object other$status = other.getStatus();
        if (this$status == null ? other$status != null : !this$status.equals(other$status)) return false;
        final java.lang.Object this$children = this.getChildren();
        final java.lang.Object other$children = other.getChildren();
        if (this$children == null ? other$children != null : !this$children.equals(other$children)) return false;
        return true;
    }
/**
 * 配合 equals 方法使用，避免继承场景下的比较错误。
 */
protected boolean canEqual(final java.lang.Object other) {
        return other instanceof LocationTreeVO;
    }
    /**
     * 返回当前对象的哈希值，便于放入集合中使用。
     */
@java.lang.Override
    public int hashCode() {
        final int PRIME = 59;
        int result = 1;
        final java.lang.Object $locationId = this.getLocationId();
        result = result * PRIME + ($locationId == null ? 43 : $locationId.hashCode());
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
        final java.lang.Object $status = this.getStatus();
        result = result * PRIME + ($status == null ? 43 : $status.hashCode());
        final java.lang.Object $children = this.getChildren();
        result = result * PRIME + ($children == null ? 43 : $children.hashCode());
        return result;
    }
    /**
     * 把当前对象转换成便于调试查看的字符串。
     */
@java.lang.Override
    public java.lang.String toString() {
        return "LocationTreeVO(locationId=" + this.getLocationId() + ", parentLocationId=" + this.getParentLocationId() + ", locationCode=" + this.getLocationCode() + ", locationName=" + this.getLocationName() + ", locationType=" + this.getLocationType() + ", floorNo=" + this.getFloorNo() + ", roomNo=" + this.getRoomNo() + ", status=" + this.getStatus() + ", children=" + this.getChildren() + ")";
    }
}
