package com.mycourse.db_backend.common;
/**
 * 无权限异常类型，用来表示特定的失败场景。
 */
public class ForbiddenException extends RuntimeException {
/**
 * 构造ForbiddenException，并注入当前类运行所需的依赖对象。
 */
public ForbiddenException(String message) {
        super(message);
    }
}
