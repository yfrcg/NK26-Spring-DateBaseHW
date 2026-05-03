package com.mycourse.db_backend.common;
/**
 * 未认证异常类型，用来表示特定的失败场景。
 */
public class UnauthorizedException extends RuntimeException {
/**
 * 构造UnauthorizedException，并注入当前类运行所需的依赖对象。
 */
public UnauthorizedException(String message) {
        super(message);
    }
}
