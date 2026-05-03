package com.mycourse.db_backend.auth;
/**
 * authenticated用户类，用来承载当前文件对应的业务职责。
 */
public record AuthenticatedUser(Long userId, String userNo, String userType, String token) {
/**
 * 执行isAdmin相关处理。
 */
public boolean isAdmin() {
        return "ADMIN".equals(userType);
    }
}
