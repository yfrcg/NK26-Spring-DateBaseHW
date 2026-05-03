package com.mycourse.db_backend.auth;

import org.springframework.core.annotation.AnnotatedElementUtils;
import org.springframework.stereotype.Component;
import org.springframework.web.method.HandlerMethod;
import org.springframework.web.servlet.HandlerInterceptor;
import com.mycourse.db_backend.common.ForbiddenException;
import com.mycourse.db_backend.common.UnauthorizedException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
/**
 * 认证拦截器，用来在请求进入业务层之前做统一处理。
 */
@Component
public class AuthInterceptor implements HandlerInterceptor {
/**
 * 认证令牌服务，用来复用相关业务逻辑。
 */
private final AuthTokenService authTokenService;
    /**
     * 执行preHandle相关处理。
     */
@Override
    public boolean preHandle(HttpServletRequest request, HttpServletResponse response, Object handler) {
        if (!(handler instanceof HandlerMethod handlerMethod)) {
            return true;
        }
        if ("OPTIONS".equalsIgnoreCase(request.getMethod()) || isPublicApi(handlerMethod)) {
            return true;
        }
        String token = extractToken(request);
        AuthenticatedUser authenticatedUser = authTokenService.resolve(token);
        request.setAttribute(AuthContext.REQUEST_ATTRIBUTE, authenticatedUser);
        if (requiresAdmin(handlerMethod) && !authenticatedUser.isAdmin()) {
            throw new ForbiddenException("Admin access required");
        }
        return true;
    }
/**
 * 执行isPublicApi相关处理。
 */
private boolean isPublicApi(HandlerMethod handlerMethod) {
        return AnnotatedElementUtils.hasAnnotation(handlerMethod.getMethod(), PublicApi.class) || AnnotatedElementUtils.hasAnnotation(handlerMethod.getBeanType(), PublicApi.class);
    }
/**
 * 执行requiresAdmin相关处理。
 */
private boolean requiresAdmin(HandlerMethod handlerMethod) {
        return AnnotatedElementUtils.hasAnnotation(handlerMethod.getMethod(), AdminOnly.class) || AnnotatedElementUtils.hasAnnotation(handlerMethod.getBeanType(), AdminOnly.class);
    }
/**
 * 执行extractToken相关处理。
 */
private String extractToken(HttpServletRequest request) {
        String authorization = request.getHeader("Authorization");
        if (authorization == null || authorization.isBlank()) {
            throw new UnauthorizedException("Login required");
        }
        if (!authorization.startsWith("Bearer ")) {
            throw new UnauthorizedException("Authorization header is invalid");
        }
        String token = authorization.substring(7).trim();
        if (token.isEmpty()) {
            throw new UnauthorizedException("Authorization token is missing");
        }
        return token;
    }
/**
 * 构造AuthInterceptor，并注入当前类运行所需的依赖对象。
 */
public AuthInterceptor(final AuthTokenService authTokenService) {
        this.authTokenService = authTokenService;
    }
}
