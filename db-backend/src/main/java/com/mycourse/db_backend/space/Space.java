package com.mycourse.db_backend.space;

import jakarta.persistence.*;
import java.time.LocalDateTime;
/**
 * 空间实体类，用来保存相关业务数据。
 */
@Entity
@Table(name = "spaces")
public class Space {
    /**
     * 保存空间ID。
     */
@Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "space_id")
    private Long spaceId;
    /**
     * 保存位置ID。
     */
@Column(name = "location_id", nullable = false)
    private Long locationId;
    /**
     * 保存计费策略ID。
     */
@Column(name = "policy_id", nullable = false)
    private Long policyId;
    /**
     * 保存空间编码。
     */
@Column(name = "space_code", nullable = false)
    private String spaceCode;
    /**
     * 保存空间名称。
     */
@Column(name = "space_name", nullable = false)
    private String spaceName;
    /**
     * 保存空间类型。
     */
@Column(name = "space_type", nullable = false)
    private String spaceType;
    /**
     * 保存容量。
     */
@Column(name = "capacity", nullable = false)
    private Integer capacity;
    /**
     * 保存设备desc。
     */
@Column(name = "equipment_desc")
    private String equipmentDesc;
    /**
     * 保存状态。
     */
@Column(name = "status", nullable = false)
    private String status;
    /**
     * 保存排序no。
     */
@Column(name = "sort_no", nullable = false)
    private Integer sortNo;
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
 * 构造Space，并注入当前类运行所需的依赖对象。
 */
public Space() {
    }
/**
 * 获取空间ID。
 */
public Long getSpaceId() {
        return this.spaceId;
    }
/**
 * 获取位置ID。
 */
public Long getLocationId() {
        return this.locationId;
    }
/**
 * 获取计费策略ID。
 */
public Long getPolicyId() {
        return this.policyId;
    }
/**
 * 获取空间编码。
 */
public String getSpaceCode() {
        return this.spaceCode;
    }
/**
 * 获取空间名称。
 */
public String getSpaceName() {
        return this.spaceName;
    }
/**
 * 获取空间类型。
 */
public String getSpaceType() {
        return this.spaceType;
    }
/**
 * 获取容量。
 */
public Integer getCapacity() {
        return this.capacity;
    }
/**
 * 获取设备desc。
 */
public String getEquipmentDesc() {
        return this.equipmentDesc;
    }
/**
 * 获取状态。
 */
public String getStatus() {
        return this.status;
    }
/**
 * 获取排序no。
 */
public Integer getSortNo() {
        return this.sortNo;
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
 * 设置空间ID。
 */
public void setSpaceId(final Long spaceId) {
        this.spaceId = spaceId;
    }
/**
 * 设置位置ID。
 */
public void setLocationId(final Long locationId) {
        this.locationId = locationId;
    }
/**
 * 设置计费策略ID。
 */
public void setPolicyId(final Long policyId) {
        this.policyId = policyId;
    }
/**
 * 设置空间编码。
 */
public void setSpaceCode(final String spaceCode) {
        this.spaceCode = spaceCode;
    }
/**
 * 设置空间名称。
 */
public void setSpaceName(final String spaceName) {
        this.spaceName = spaceName;
    }
/**
 * 设置空间类型。
 */
public void setSpaceType(final String spaceType) {
        this.spaceType = spaceType;
    }
/**
 * 设置容量。
 */
public void setCapacity(final Integer capacity) {
        this.capacity = capacity;
    }
/**
 * 设置设备desc。
 */
public void setEquipmentDesc(final String equipmentDesc) {
        this.equipmentDesc = equipmentDesc;
    }
/**
 * 设置状态。
 */
public void setStatus(final String status) {
        this.status = status;
    }
/**
 * 设置排序no。
 */
public void setSortNo(final Integer sortNo) {
        this.sortNo = sortNo;
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
     * 比较当前对象和另一个对象是否表示同一份业务数据。
     */
@java.lang.Override
    public boolean equals(final java.lang.Object o) {
        if (o == this) return true;
        if (!(o instanceof Space)) return false;
        final Space other = (Space) o;
        if (!other.canEqual((java.lang.Object) this)) return false;
        final java.lang.Object this$spaceId = this.getSpaceId();
        final java.lang.Object other$spaceId = other.getSpaceId();
        if (this$spaceId == null ? other$spaceId != null : !this$spaceId.equals(other$spaceId)) return false;
        final java.lang.Object this$locationId = this.getLocationId();
        final java.lang.Object other$locationId = other.getLocationId();
        if (this$locationId == null ? other$locationId != null : !this$locationId.equals(other$locationId)) return false;
        final java.lang.Object this$policyId = this.getPolicyId();
        final java.lang.Object other$policyId = other.getPolicyId();
        if (this$policyId == null ? other$policyId != null : !this$policyId.equals(other$policyId)) return false;
        final java.lang.Object this$capacity = this.getCapacity();
        final java.lang.Object other$capacity = other.getCapacity();
        if (this$capacity == null ? other$capacity != null : !this$capacity.equals(other$capacity)) return false;
        final java.lang.Object this$sortNo = this.getSortNo();
        final java.lang.Object other$sortNo = other.getSortNo();
        if (this$sortNo == null ? other$sortNo != null : !this$sortNo.equals(other$sortNo)) return false;
        final java.lang.Object this$isDeleted = this.getIsDeleted();
        final java.lang.Object other$isDeleted = other.getIsDeleted();
        if (this$isDeleted == null ? other$isDeleted != null : !this$isDeleted.equals(other$isDeleted)) return false;
        final java.lang.Object this$spaceCode = this.getSpaceCode();
        final java.lang.Object other$spaceCode = other.getSpaceCode();
        if (this$spaceCode == null ? other$spaceCode != null : !this$spaceCode.equals(other$spaceCode)) return false;
        final java.lang.Object this$spaceName = this.getSpaceName();
        final java.lang.Object other$spaceName = other.getSpaceName();
        if (this$spaceName == null ? other$spaceName != null : !this$spaceName.equals(other$spaceName)) return false;
        final java.lang.Object this$spaceType = this.getSpaceType();
        final java.lang.Object other$spaceType = other.getSpaceType();
        if (this$spaceType == null ? other$spaceType != null : !this$spaceType.equals(other$spaceType)) return false;
        final java.lang.Object this$equipmentDesc = this.getEquipmentDesc();
        final java.lang.Object other$equipmentDesc = other.getEquipmentDesc();
        if (this$equipmentDesc == null ? other$equipmentDesc != null : !this$equipmentDesc.equals(other$equipmentDesc)) return false;
        final java.lang.Object this$status = this.getStatus();
        final java.lang.Object other$status = other.getStatus();
        if (this$status == null ? other$status != null : !this$status.equals(other$status)) return false;
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
        return other instanceof Space;
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
        final java.lang.Object $locationId = this.getLocationId();
        result = result * PRIME + ($locationId == null ? 43 : $locationId.hashCode());
        final java.lang.Object $policyId = this.getPolicyId();
        result = result * PRIME + ($policyId == null ? 43 : $policyId.hashCode());
        final java.lang.Object $capacity = this.getCapacity();
        result = result * PRIME + ($capacity == null ? 43 : $capacity.hashCode());
        final java.lang.Object $sortNo = this.getSortNo();
        result = result * PRIME + ($sortNo == null ? 43 : $sortNo.hashCode());
        final java.lang.Object $isDeleted = this.getIsDeleted();
        result = result * PRIME + ($isDeleted == null ? 43 : $isDeleted.hashCode());
        final java.lang.Object $spaceCode = this.getSpaceCode();
        result = result * PRIME + ($spaceCode == null ? 43 : $spaceCode.hashCode());
        final java.lang.Object $spaceName = this.getSpaceName();
        result = result * PRIME + ($spaceName == null ? 43 : $spaceName.hashCode());
        final java.lang.Object $spaceType = this.getSpaceType();
        result = result * PRIME + ($spaceType == null ? 43 : $spaceType.hashCode());
        final java.lang.Object $equipmentDesc = this.getEquipmentDesc();
        result = result * PRIME + ($equipmentDesc == null ? 43 : $equipmentDesc.hashCode());
        final java.lang.Object $status = this.getStatus();
        result = result * PRIME + ($status == null ? 43 : $status.hashCode());
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
        return "Space(spaceId=" + this.getSpaceId() + ", locationId=" + this.getLocationId() + ", policyId=" + this.getPolicyId() + ", spaceCode=" + this.getSpaceCode() + ", spaceName=" + this.getSpaceName() + ", spaceType=" + this.getSpaceType() + ", capacity=" + this.getCapacity() + ", equipmentDesc=" + this.getEquipmentDesc() + ", status=" + this.getStatus() + ", sortNo=" + this.getSortNo() + ", createdAt=" + this.getCreatedAt() + ", updatedAt=" + this.getUpdatedAt() + ", isDeleted=" + this.getIsDeleted() + ")";
    }
}
