package com.mycourse.db_backend.common;
/**
 * 业务异常类型，用来表示特定的失败场景。
 */
public class BusinessException extends RuntimeException {
/**
 * 构造BusinessException，并注入当前类运行所需的依赖对象。
 */
public BusinessException(String message) {
        super(message);
    }
}
