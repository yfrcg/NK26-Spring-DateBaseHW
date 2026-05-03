package com.mycourse.db_backend.location;

import java.time.LocalDateTime;
import java.time.LocalTime;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
/**
 * 位置实体类，用来保存相关业务数据。
 */
@Entity
@Table(name = "locations")
public class Location {
    /**
     * 保存位置ID。
     */
@Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "location_id")
    private Long locationId;
    /**
     * 保存父级位置ID。
     */
@Column(name = "parent_location_id")
    private Long parentLocationId;
    /**
     * 保存位置编码。
     */
@Column(name = "location_code", nullable = false, unique = true)
    private String locationCode;
    /**
     * 保存位置名称。
     */
@Column(name = "location_name", nullable = false)
    private String locationName;
    /**
     * 保存位置类型。
     */
@Column(name = "location_type", nullable = false)
    private String locationType;
    /**
     * 保存楼层no。
     */
@Column(name = "floor_no")
    private String floorNo;
    /**
     * 保存房间no。
     */
@Column(name = "room_no")
    private String roomNo;
    /**
     * 保存开放时间。
     */
@Column(name = "open_time", nullable = false)
    private LocalTime openTime;
    /**
     * 保存关闭时间。
     */
@Column(name = "close_time", nullable = false)
    private LocalTime closeTime;
    /**
     * 保存状态。
     */
@Column(name = "status", nullable = false)
    private String status;
    /**
     * 保存备注。
     */
@Column(name = "remarks")
    private String remarks;
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
     * 保存逻辑删除标记。
     */
@Column(name = "is_deleted", nullable = false)
    private Integer isDeleted;
    /**
     * 保存删除at。
     */
@Column(name = "deleted_at")
    private LocalDateTime deletedAt;
    /**
     * 保存删除by。
     */
@Column(name = "deleted_by")
    private Long deletedBy;
/**
 * 构造Location，并注入当前类运行所需的依赖对象。
 */
public Location() {
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
 * 获取状态。
 */
public String getStatus() {
        return this.status;
    }
/**
 * 获取备注。
 */
public String getRemarks() {
        return this.remarks;
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
 * 获取逻辑删除标记。
 */
public Integer getIsDeleted() {
        return this.isDeleted;
    }
/**
 * 获取删除at。
 */
public LocalDateTime getDeletedAt() {
        return this.deletedAt;
    }
/**
 * 获取删除by。
 */
public Long getDeletedBy() {
        return this.deletedBy;
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
 * 设置状态。
 */
public void setStatus(final String status) {
        this.status = status;
    }
/**
 * 设置备注。
 */
public void setRemarks(final String remarks) {
        this.remarks = remarks;
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
 * 设置逻辑删除标记。
 */
public void setIsDeleted(final Integer isDeleted) {
        this.isDeleted = isDeleted;
    }
/**
 * 设置删除at。
 */
public void setDeletedAt(final LocalDateTime deletedAt) {
        this.deletedAt = deletedAt;
    }
/**
 * 设置删除by。
 */
public void setDeletedBy(final Long deletedBy) {
        this.deletedBy = deletedBy;
    }
    /**
     * 比较当前对象和另一个对象是否表示同一份业务数据。
     */
@java.lang.Override
    public boolean equals(final java.lang.Object o) {
        if (o == this) return true;
        if (!(o instanceof Location)) return false;
        final Location other = (Location) o;
        if (!other.canEqual((java.lang.Object) this)) return false;
        final java.lang.Object this$locationId = this.getLocationId();
        final java.lang.Object other$locationId = other.getLocationId();
        if (this$locationId == null ? other$locationId != null : !this$locationId.equals(other$locationId)) return false;
        final java.lang.Object this$parentLocationId = this.getParentLocationId();
        final java.lang.Object other$parentLocationId = other.getParentLocationId();
        if (this$parentLocationId == null ? other$parentLocationId != null : !this$parentLocationId.equals(other$parentLocationId)) return false;
        final java.lang.Object this$isDeleted = this.getIsDeleted();
        final java.lang.Object other$isDeleted = other.getIsDeleted();
        if (this$isDeleted == null ? other$isDeleted != null : !this$isDeleted.equals(other$isDeleted)) return false;
        final java.lang.Object this$deletedBy = this.getDeletedBy();
        final java.lang.Object other$deletedBy = other.getDeletedBy();
        if (this$deletedBy == null ? other$deletedBy != null : !this$deletedBy.equals(other$deletedBy)) return false;
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
        final java.lang.Object this$status = this.getStatus();
        final java.lang.Object other$status = other.getStatus();
        if (this$status == null ? other$status != null : !this$status.equals(other$status)) return false;
        final java.lang.Object this$remarks = this.getRemarks();
        final java.lang.Object other$remarks = other.getRemarks();
        if (this$remarks == null ? other$remarks != null : !this$remarks.equals(other$remarks)) return false;
        final java.lang.Object this$createdAt = this.getCreatedAt();
        final java.lang.Object other$createdAt = other.getCreatedAt();
        if (this$createdAt == null ? other$createdAt != null : !this$createdAt.equals(other$createdAt)) return false;
        final java.lang.Object this$updatedAt = this.getUpdatedAt();
        final java.lang.Object other$updatedAt = other.getUpdatedAt();
        if (this$updatedAt == null ? other$updatedAt != null : !this$updatedAt.equals(other$updatedAt)) return false;
        final java.lang.Object this$deletedAt = this.getDeletedAt();
        final java.lang.Object other$deletedAt = other.getDeletedAt();
        if (this$deletedAt == null ? other$deletedAt != null : !this$deletedAt.equals(other$deletedAt)) return false;
        return true;
    }
/**
 * 配合 equals 方法使用，避免继承场景下的比较错误。
 */
protected boolean canEqual(final java.lang.Object other) {
        return other instanceof Location;
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
        final java.lang.Object $isDeleted = this.getIsDeleted();
        result = result * PRIME + ($isDeleted == null ? 43 : $isDeleted.hashCode());
        final java.lang.Object $deletedBy = this.getDeletedBy();
        result = result * PRIME + ($deletedBy == null ? 43 : $deletedBy.hashCode());
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
        final java.lang.Object $status = this.getStatus();
        result = result * PRIME + ($status == null ? 43 : $status.hashCode());
        final java.lang.Object $remarks = this.getRemarks();
        result = result * PRIME + ($remarks == null ? 43 : $remarks.hashCode());
        final java.lang.Object $createdAt = this.getCreatedAt();
        result = result * PRIME + ($createdAt == null ? 43 : $createdAt.hashCode());
        final java.lang.Object $updatedAt = this.getUpdatedAt();
        result = result * PRIME + ($updatedAt == null ? 43 : $updatedAt.hashCode());
        final java.lang.Object $deletedAt = this.getDeletedAt();
        result = result * PRIME + ($deletedAt == null ? 43 : $deletedAt.hashCode());
        return result;
    }
    /**
     * 把当前对象转换成便于调试查看的字符串。
     */
@java.lang.Override
    public java.lang.String toString() {
        return "Location(locationId=" + this.getLocationId() + ", parentLocationId=" + this.getParentLocationId() + ", locationCode=" + this.getLocationCode() + ", locationName=" + this.getLocationName() + ", locationType=" + this.getLocationType() + ", floorNo=" + this.getFloorNo() + ", roomNo=" + this.getRoomNo() + ", openTime=" + this.getOpenTime() + ", closeTime=" + this.getCloseTime() + ", status=" + this.getStatus() + ", remarks=" + this.getRemarks() + ", createdAt=" + this.getCreatedAt() + ", updatedAt=" + this.getUpdatedAt() + ", isDeleted=" + this.getIsDeleted() + ", deletedAt=" + this.getDeletedAt() + ", deletedBy=" + this.getDeletedBy() + ")";
    }
}
