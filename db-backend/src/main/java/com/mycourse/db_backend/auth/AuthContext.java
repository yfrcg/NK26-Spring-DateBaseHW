package com.mycourse.db_backend.auth;

import org.springframework.web.context.request.RequestContextHolder;
import org.springframework.web.context.request.ServletRequestAttributes;

import com.mycourse.db_backend.common.UnauthorizedException;
/**
 * 认证上下文工具类，用来在当前线程中保存已登录用户信息。
 */
public final class AuthContext {

    public static final String REQUEST_ATTRIBUTE = AuthenticatedUser.class.getName();
/**
 * 构造AuthContext，并注入当前类运行所需的依赖对象。
 */
private AuthContext() {
    }
/**
 * 获取当前令牌对应的用户信息。
 */
public static AuthenticatedUser getCurrentUser() {
        var attributes = RequestContextHolder.getRequestAttributes();
        if (!(attributes instanceof ServletRequestAttributes servletAttributes)) {
            throw new UnauthorizedException("Login required");
        }

        Object value = servletAttributes.getRequest().getAttribute(REQUEST_ATTRIBUTE);
        if (value instanceof AuthenticatedUser authenticatedUser) {
            return authenticatedUser;
        }

        throw new UnauthorizedException("Login required");
    }
}
