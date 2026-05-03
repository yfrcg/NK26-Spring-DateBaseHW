package com.mycourse.db_backend.auth;

import com.mycourse.db_backend.user.User;
/**
 * 认证响应对象，用来封装接口返回数据。
 */
public record AuthResponse(String token, User user) {
}
