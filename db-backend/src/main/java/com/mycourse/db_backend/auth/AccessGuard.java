package com.mycourse.db_backend.auth;

import java.util.Objects;

import org.springframework.stereotype.Component;

import com.mycourse.db_backend.common.ForbiddenException;
/**
 * 访问控制辅助类，用来判断当前请求是否需要登录或管理员权限。
 */
@Component
public class AccessGuard {
/**
 * 执行currentUser相关处理。
 */
public AuthenticatedUser currentUser() {
        return AuthContext.getCurrentUser();
    }
/**
 * 执行requireAdmin相关处理。
 */
public void requireAdmin() {
        if (!currentUser().isAdmin()) {
            throw new ForbiddenException("Admin access required");
        }
    }
/**
 * 执行requireSelfOrAdmin相关处理。
 */
public void requireSelfOrAdmin(Long userId) {
        AuthenticatedUser authenticatedUser = currentUser();
        if (authenticatedUser.isAdmin()) {
            return;
        }

        if (!Objects.equals(authenticatedUser.userId(), userId)) {
            throw new ForbiddenException("You do not have permission to access this resource");
        }
    }
}
