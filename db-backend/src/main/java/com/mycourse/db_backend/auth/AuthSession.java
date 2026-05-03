package com.mycourse.db_backend.auth;

import java.time.LocalDateTime;
/**
 * 认证会话类，用来承载当前文件对应的业务职责。
 */
public record AuthSession(AuthenticatedUser user, LocalDateTime expiresAt) {
/**
 * 执行isExpired相关处理。
 */
public boolean isExpired(LocalDateTime now) {
        return expiresAt.isBefore(now);
    }
}
