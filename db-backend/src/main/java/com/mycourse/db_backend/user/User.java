package com.mycourse.db_backend.user;

import java.time.LocalDateTime;
import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
/**
 * 用户实体类，用来保存相关业务数据。
 */
@Entity
@Table(name = "users")
public class User {
    /**
     * 保存用户ID。
     */
@Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "user_id")
    private Long userId;
    /**
     * 保存用户编号。
     */
@Column(name = "user_no", nullable = false, unique = true, length = 32)
    private String userNo;
    /**
     * 保存真实姓名。
     */
@Column(name = "real_name", nullable = false, length = 50)
    private String realName;
    /**
     * 保存手机号。
     */
@Column(name = "phone", length = 20)
    private String phone;
    /**
     * 保存邮箱地址。
     */
@Column(name = "email", length = 100)
    private String email;
    /**
     * 保存加密后的密码。
     */
@JsonIgnore
    @Column(name = "password_hash", nullable = false, length = 100)
    private String passwordHash;
    /**
     * 保存用户类型。
     */
@Column(name = "user_type", nullable = false, length = 20)
    private String userType;
    /**
     * 保存账户状态。
     */
@Column(name = "account_status", nullable = false, length = 20)
    private String accountStatus;
    /**
     * 保存信用分。
     */
@Column(name = "credit_score", nullable = false)
    private Integer creditScore;
    /**
     * 保存lastlogin时间。
     */
@Column(name = "last_login_time")
    private LocalDateTime lastLoginTime;
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
 * 构造User，并注入当前类运行所需的依赖对象。
 */
public User() {
    }
/**
 * 获取用户ID。
 */
public Long getUserId() {
        return this.userId;
    }
/**
 * 获取用户编号。
 */
public String getUserNo() {
        return this.userNo;
    }
/**
 * 获取真实姓名。
 */
public String getRealName() {
        return this.realName;
    }
/**
 * 获取手机号。
 */
public String getPhone() {
        return this.phone;
    }
/**
 * 获取邮箱地址。
 */
public String getEmail() {
        return this.email;
    }
/**
 * 获取加密后的密码。
 */
public String getPasswordHash() {
        return this.passwordHash;
    }
/**
 * 获取用户类型。
 */
public String getUserType() {
        return this.userType;
    }
/**
 * 获取账户状态。
 */
public String getAccountStatus() {
        return this.accountStatus;
    }
/**
 * 获取信用分。
 */
public Integer getCreditScore() {
        return this.creditScore;
    }
/**
 * 获取lastlogin时间。
 */
public LocalDateTime getLastLoginTime() {
        return this.lastLoginTime;
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
 * 设置用户ID。
 */
public void setUserId(final Long userId) {
        this.userId = userId;
    }
/**
 * 设置用户编号。
 */
public void setUserNo(final String userNo) {
        this.userNo = userNo;
    }
/**
 * 设置真实姓名。
 */
public void setRealName(final String realName) {
        this.realName = realName;
    }
/**
 * 设置手机号。
 */
public void setPhone(final String phone) {
        this.phone = phone;
    }
/**
 * 设置邮箱地址。
 */
public void setEmail(final String email) {
        this.email = email;
    }
/**
 * 设置加密后的密码。
 */
public void setPasswordHash(final String passwordHash) {
        this.passwordHash = passwordHash;
    }
/**
 * 设置用户类型。
 */
public void setUserType(final String userType) {
        this.userType = userType;
    }
/**
 * 设置账户状态。
 */
public void setAccountStatus(final String accountStatus) {
        this.accountStatus = accountStatus;
    }
/**
 * 设置信用分。
 */
public void setCreditScore(final Integer creditScore) {
        this.creditScore = creditScore;
    }
/**
 * 设置lastlogin时间。
 */
public void setLastLoginTime(final LocalDateTime lastLoginTime) {
        this.lastLoginTime = lastLoginTime;
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
        if (!(o instanceof User)) return false;
        final User other = (User) o;
        if (!other.canEqual((java.lang.Object) this)) return false;
        final java.lang.Object this$userId = this.getUserId();
        final java.lang.Object other$userId = other.getUserId();
        if (this$userId == null ? other$userId != null : !this$userId.equals(other$userId)) return false;
        final java.lang.Object this$creditScore = this.getCreditScore();
        final java.lang.Object other$creditScore = other.getCreditScore();
        if (this$creditScore == null ? other$creditScore != null : !this$creditScore.equals(other$creditScore)) return false;
        final java.lang.Object this$isDeleted = this.getIsDeleted();
        final java.lang.Object other$isDeleted = other.getIsDeleted();
        if (this$isDeleted == null ? other$isDeleted != null : !this$isDeleted.equals(other$isDeleted)) return false;
        final java.lang.Object this$deletedBy = this.getDeletedBy();
        final java.lang.Object other$deletedBy = other.getDeletedBy();
        if (this$deletedBy == null ? other$deletedBy != null : !this$deletedBy.equals(other$deletedBy)) return false;
        final java.lang.Object this$userNo = this.getUserNo();
        final java.lang.Object other$userNo = other.getUserNo();
        if (this$userNo == null ? other$userNo != null : !this$userNo.equals(other$userNo)) return false;
        final java.lang.Object this$realName = this.getRealName();
        final java.lang.Object other$realName = other.getRealName();
        if (this$realName == null ? other$realName != null : !this$realName.equals(other$realName)) return false;
        final java.lang.Object this$phone = this.getPhone();
        final java.lang.Object other$phone = other.getPhone();
        if (this$phone == null ? other$phone != null : !this$phone.equals(other$phone)) return false;
        final java.lang.Object this$email = this.getEmail();
        final java.lang.Object other$email = other.getEmail();
        if (this$email == null ? other$email != null : !this$email.equals(other$email)) return false;
        final java.lang.Object this$passwordHash = this.getPasswordHash();
        final java.lang.Object other$passwordHash = other.getPasswordHash();
        if (this$passwordHash == null ? other$passwordHash != null : !this$passwordHash.equals(other$passwordHash)) return false;
        final java.lang.Object this$userType = this.getUserType();
        final java.lang.Object other$userType = other.getUserType();
        if (this$userType == null ? other$userType != null : !this$userType.equals(other$userType)) return false;
        final java.lang.Object this$accountStatus = this.getAccountStatus();
        final java.lang.Object other$accountStatus = other.getAccountStatus();
        if (this$accountStatus == null ? other$accountStatus != null : !this$accountStatus.equals(other$accountStatus)) return false;
        final java.lang.Object this$lastLoginTime = this.getLastLoginTime();
        final java.lang.Object other$lastLoginTime = other.getLastLoginTime();
        if (this$lastLoginTime == null ? other$lastLoginTime != null : !this$lastLoginTime.equals(other$lastLoginTime)) return false;
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
        return other instanceof User;
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
        final java.lang.Object $creditScore = this.getCreditScore();
        result = result * PRIME + ($creditScore == null ? 43 : $creditScore.hashCode());
        final java.lang.Object $isDeleted = this.getIsDeleted();
        result = result * PRIME + ($isDeleted == null ? 43 : $isDeleted.hashCode());
        final java.lang.Object $deletedBy = this.getDeletedBy();
        result = result * PRIME + ($deletedBy == null ? 43 : $deletedBy.hashCode());
        final java.lang.Object $userNo = this.getUserNo();
        result = result * PRIME + ($userNo == null ? 43 : $userNo.hashCode());
        final java.lang.Object $realName = this.getRealName();
        result = result * PRIME + ($realName == null ? 43 : $realName.hashCode());
        final java.lang.Object $phone = this.getPhone();
        result = result * PRIME + ($phone == null ? 43 : $phone.hashCode());
        final java.lang.Object $email = this.getEmail();
        result = result * PRIME + ($email == null ? 43 : $email.hashCode());
        final java.lang.Object $passwordHash = this.getPasswordHash();
        result = result * PRIME + ($passwordHash == null ? 43 : $passwordHash.hashCode());
        final java.lang.Object $userType = this.getUserType();
        result = result * PRIME + ($userType == null ? 43 : $userType.hashCode());
        final java.lang.Object $accountStatus = this.getAccountStatus();
        result = result * PRIME + ($accountStatus == null ? 43 : $accountStatus.hashCode());
        final java.lang.Object $lastLoginTime = this.getLastLoginTime();
        result = result * PRIME + ($lastLoginTime == null ? 43 : $lastLoginTime.hashCode());
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
        return "User(userId=" + this.getUserId() + ", userNo=" + this.getUserNo() + ", realName=" + this.getRealName() + ", phone=" + this.getPhone() + ", email=" + this.getEmail() + ", passwordHash=" + this.getPasswordHash() + ", userType=" + this.getUserType() + ", accountStatus=" + this.getAccountStatus() + ", creditScore=" + this.getCreditScore() + ", lastLoginTime=" + this.getLastLoginTime() + ", createdAt=" + this.getCreatedAt() + ", updatedAt=" + this.getUpdatedAt() + ", isDeleted=" + this.getIsDeleted() + ", deletedAt=" + this.getDeletedAt() + ", deletedBy=" + this.getDeletedBy() + ")";
    }
}
