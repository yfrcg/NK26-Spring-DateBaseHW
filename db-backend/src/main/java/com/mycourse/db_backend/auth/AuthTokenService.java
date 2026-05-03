package com.mycourse.db_backend.auth;

import java.time.LocalDateTime;
import java.util.Map;
import java.util.UUID;
import java.util.concurrent.ConcurrentHashMap;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import com.mycourse.db_backend.common.UnauthorizedException;
import com.mycourse.db_backend.user.User;
/**
 * 令牌服务，负责创建、查找和撤销登录会话。
 */
@Service
public class AuthTokenService {

    private final Map<String, AuthSession> sessions = new ConcurrentHashMap<>();
/**
 * 保存令牌ttlhours。
 */
private final long tokenTtlHours;
/**
 * 构造AuthTokenService，并注入当前类运行所需的依赖对象。
 */
public AuthTokenService(@Value("${app.auth.token-ttl-hours:24}") long tokenTtlHours) {
        this.tokenTtlHours = tokenTtlHours;
    }
/**
 * 创建会话。
 */
public AuthenticatedUser createSession(User user) {
        LocalDateTime now = LocalDateTime.now();
        cleanupExpired(now);

        String token = UUID.randomUUID().toString().replace("-", "");
        AuthenticatedUser authenticatedUser =
                new AuthenticatedUser(user.getUserId(), user.getUserNo(), user.getUserType(), token);
        sessions.put(token, new AuthSession(authenticatedUser, now.plusHours(tokenTtlHours)));
        return authenticatedUser;
    }
/**
 * 执行resolve相关处理。
 */
public AuthenticatedUser resolve(String token) {
        LocalDateTime now = LocalDateTime.now();
        AuthSession session = sessions.get(token);
        if (session == null) {
            throw new UnauthorizedException("Session has expired, please log in again");
        }

        if (session.isExpired(now)) {
            sessions.remove(token);
            throw new UnauthorizedException("Session has expired, please log in again");
        }

        return session.user();
    }
/**
 * 执行revoke相关处理。
 */
public void revoke(String token) {
        if (token != null && !token.isBlank()) {
            sessions.remove(token);
        }
    }
/**
 * 执行cleanupExpired相关处理。
 */
private void cleanupExpired(LocalDateTime now) {
        sessions.entrySet().removeIf(entry -> entry.getValue().isExpired(now));
    }
}
