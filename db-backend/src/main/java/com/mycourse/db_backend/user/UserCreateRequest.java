package com.mycourse.db_backend.user;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
/**
 * 用户创建请求参数对象，用来封装接口入参。
 */
public class UserCreateRequest {
    /**
     * 保存用户编号。
     */
@NotBlank(message = "User number is required")
    private String userNo;
    /**
     * 保存真实姓名。
     */
@NotBlank(message = "Real name is required")
    private String realName;
    /**
     * 保存手机号。
     */
@Size(max = 20, message = "Phone number cannot exceed 20 characters")
    private String phone;
    /**
     * 保存邮箱地址。
     */
@Email(message = "Email format is invalid")
    private String email;
    /**
     * 保存密码。
     */
@NotBlank(message = "Password is required")
    @Size(min = 6, max = 64, message = "Password length must be between 6 and 64 characters")
    private String password;
/**
 * 保存用户类型。
 */
private String userType;
/**
 * 构造UserCreateRequest，并注入当前类运行所需的依赖对象。
 */
public UserCreateRequest() {
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
 * 获取密码。
 */
public String getPassword() {
        return this.password;
    }
/**
 * 获取用户类型。
 */
public String getUserType() {
        return this.userType;
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
 * 设置密码。
 */
public void setPassword(final String password) {
        this.password = password;
    }
/**
 * 设置用户类型。
 */
public void setUserType(final String userType) {
        this.userType = userType;
    }
    /**
     * 比较当前对象和另一个对象是否表示同一份业务数据。
     */
@java.lang.Override
    public boolean equals(final java.lang.Object o) {
        if (o == this) return true;
        if (!(o instanceof UserCreateRequest)) return false;
        final UserCreateRequest other = (UserCreateRequest) o;
        if (!other.canEqual((java.lang.Object) this)) return false;
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
        final java.lang.Object this$password = this.getPassword();
        final java.lang.Object other$password = other.getPassword();
        if (this$password == null ? other$password != null : !this$password.equals(other$password)) return false;
        final java.lang.Object this$userType = this.getUserType();
        final java.lang.Object other$userType = other.getUserType();
        if (this$userType == null ? other$userType != null : !this$userType.equals(other$userType)) return false;
        return true;
    }
/**
 * 配合 equals 方法使用，避免继承场景下的比较错误。
 */
protected boolean canEqual(final java.lang.Object other) {
        return other instanceof UserCreateRequest;
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
        final java.lang.Object $realName = this.getRealName();
        result = result * PRIME + ($realName == null ? 43 : $realName.hashCode());
        final java.lang.Object $phone = this.getPhone();
        result = result * PRIME + ($phone == null ? 43 : $phone.hashCode());
        final java.lang.Object $email = this.getEmail();
        result = result * PRIME + ($email == null ? 43 : $email.hashCode());
        final java.lang.Object $password = this.getPassword();
        result = result * PRIME + ($password == null ? 43 : $password.hashCode());
        final java.lang.Object $userType = this.getUserType();
        result = result * PRIME + ($userType == null ? 43 : $userType.hashCode());
        return result;
    }
    /**
     * 把当前对象转换成便于调试查看的字符串。
     */
@java.lang.Override
    public java.lang.String toString() {
        return "UserCreateRequest(userNo=" + this.getUserNo() + ", realName=" + this.getRealName() + ", phone=" + this.getPhone() + ", email=" + this.getEmail() + ", password=" + this.getPassword() + ", userType=" + this.getUserType() + ")";
    }
}
