package com.mycourse.db_backend.auth;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
/**
 * 变动密码请求参数对象，用来封装接口入参。
 */
public class ChangePasswordRequest {
    /**
     * 保存当前密码。
     */
@NotBlank(message = "Current password is required")
    private String currentPassword;
    /**
     * 保存新密码。
     */
@NotBlank(message = "New password is required")
    @Size(min = 6, max = 64, message = "New password length must be between 6 and 64 characters")
    private String newPassword;
/**
 * 构造ChangePasswordRequest，并注入当前类运行所需的依赖对象。
 */
public ChangePasswordRequest() {
    }
/**
 * 获取当前密码。
 */
public String getCurrentPassword() {
        return this.currentPassword;
    }
/**
 * 获取新密码。
 */
public String getNewPassword() {
        return this.newPassword;
    }
/**
 * 设置当前密码。
 */
public void setCurrentPassword(final String currentPassword) {
        this.currentPassword = currentPassword;
    }
/**
 * 设置新密码。
 */
public void setNewPassword(final String newPassword) {
        this.newPassword = newPassword;
    }
    /**
     * 比较当前对象和另一个对象是否表示同一份业务数据。
     */
@java.lang.Override
    public boolean equals(final java.lang.Object o) {
        if (o == this) return true;
        if (!(o instanceof ChangePasswordRequest)) return false;
        final ChangePasswordRequest other = (ChangePasswordRequest) o;
        if (!other.canEqual((java.lang.Object) this)) return false;
        final java.lang.Object this$currentPassword = this.getCurrentPassword();
        final java.lang.Object other$currentPassword = other.getCurrentPassword();
        if (this$currentPassword == null ? other$currentPassword != null : !this$currentPassword.equals(other$currentPassword)) return false;
        final java.lang.Object this$newPassword = this.getNewPassword();
        final java.lang.Object other$newPassword = other.getNewPassword();
        if (this$newPassword == null ? other$newPassword != null : !this$newPassword.equals(other$newPassword)) return false;
        return true;
    }
/**
 * 配合 equals 方法使用，避免继承场景下的比较错误。
 */
protected boolean canEqual(final java.lang.Object other) {
        return other instanceof ChangePasswordRequest;
    }
    /**
     * 返回当前对象的哈希值，便于放入集合中使用。
     */
@java.lang.Override
    public int hashCode() {
        final int PRIME = 59;
        int result = 1;
        final java.lang.Object $currentPassword = this.getCurrentPassword();
        result = result * PRIME + ($currentPassword == null ? 43 : $currentPassword.hashCode());
        final java.lang.Object $newPassword = this.getNewPassword();
        result = result * PRIME + ($newPassword == null ? 43 : $newPassword.hashCode());
        return result;
    }
    /**
     * 把当前对象转换成便于调试查看的字符串。
     */
@java.lang.Override
    public java.lang.String toString() {
        return "ChangePasswordRequest(currentPassword=" + this.getCurrentPassword() + ", newPassword=" + this.getNewPassword() + ")";
    }
}
