package com.mycourse.db_backend.auth;

import com.mycourse.db_backend.user.User;
/**
 * 认证服务接口，用来定义对外提供的业务能力。
 */
public interface AuthService {
/**
 * 处理登录逻辑，并在成功后返回新的登录令牌。
 */
AuthResponse login(LoginRequest request);
/**
 * 处理注册逻辑，并在成功后直接创建登录会话。
 */
AuthResponse register(RegisterRequest request);
/**
 * 获取当前令牌对应的用户信息。
 */
User getCurrentUser();
/**
 * 修改当前登录用户的密码。
 */
User changePassword(ChangePasswordRequest request);
/**
 * 退出当前登录会话。
 */
void logout();
}
