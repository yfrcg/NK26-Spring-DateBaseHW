package com.mycourse.db_backend.auth;

import jakarta.validation.constraints.NotBlank;
/**
 * login请求参数对象，用来封装接口入参。
 */
public class LoginRequest {
    /**
     * 保存用户编号。
     */
@NotBlank(message = "User number is required")
    private String userNo;
    /**
     * 保存密码。
     */
@NotBlank(message = "Password is required")
    private String password;
/**
 * 构造LoginRequest，并注入当前类运行所需的依赖对象。
 */
public LoginRequest() {
    }
/**
 * 获取用户编号。
 */
public String getUserNo() {
        return this.userNo;
    }
/**
 * 获取密码。
 */
public String getPassword() {
        return this.password;
    }
/**
 * 设置用户编号。
 */
public void setUserNo(final String userNo) {
        this.userNo = userNo;
    }
/**
 * 设置密码。
 */
public void setPassword(final String password) {
        this.password = password;
    }
    /**
     * 比较当前对象和另一个对象是否表示同一份业务数据。
     */
@java.lang.Override
    public boolean equals(final java.lang.Object o) {
        if (o == this) return true;
        if (!(o instanceof LoginRequest)) return false;
        final LoginRequest other = (LoginRequest) o;
        if (!other.canEqual((java.lang.Object) this)) return false;
        final java.lang.Object this$userNo = this.getUserNo();
        final java.lang.Object other$userNo = other.getUserNo();
        if (this$userNo == null ? other$userNo != null : !this$userNo.equals(other$userNo)) return false;
        final java.lang.Object this$password = this.getPassword();
        final java.lang.Object other$password = other.getPassword();
        if (this$password == null ? other$password != null : !this$password.equals(other$password)) return false;
        return true;
    }
/**
 * 配合 equals 方法使用，避免继承场景下的比较错误。
 */
protected boolean canEqual(final java.lang.Object other) {
        return other instanceof LoginRequest;
    }
    /**
     * 返回当前对象的哈希值，便于放入集合中使用。
     */
@java.lang.Override
    public int hashCode() {
        final int PRIME = 59;
        int result = 1;
        final java.lang.Object $userNo = this.getUserNo();
        result = result * PRIME + ($userNo == null ? 43 : $userNo.hashCode());
        final java.lang.Object $password = this.getPassword();
        result = result * PRIME + ($password == null ? 43 : $password.hashCode());
        return result;
    }
    /**
     * 把当前对象转换成便于调试查看的字符串。
     */
@java.lang.Override
    public java.lang.String toString() {
        return "LoginRequest(userNo=" + this.getUserNo() + ", password=" + this.getPassword() + ")";
    }
}
