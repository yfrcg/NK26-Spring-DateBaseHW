package com.mycourse.db_backend.common;

import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.http.converter.HttpMessageNotReadableException;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
/**
 * globalexceptionhandler类，用来承载当前文件对应的业务职责。
 */
@RestControllerAdvice
public class GlobalExceptionHandler {
    private static final org.slf4j.Logger log = org.slf4j.LoggerFactory.getLogger(GlobalExceptionHandler.class);
    /**
     * 执行handleBusinessException相关处理。
     */
@ExceptionHandler(BusinessException.class)
    public ResponseEntity<Result<String>> handleBusinessException(BusinessException e) {
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(Result.fail(HttpStatus.BAD_REQUEST.value(), e.getMessage()));
    }
    /**
     * 执行handleValidationException相关处理。
     */
@ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<Result<String>> handleValidationException(MethodArgumentNotValidException e) {
        String msg = e.getBindingResult().getFieldError() != null ? e.getBindingResult().getFieldError().getDefaultMessage() : "Request validation failed";
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(Result.fail(HttpStatus.BAD_REQUEST.value(), msg));
    }
    /**
     * 执行handleHttpMessageNotReadableException相关处理。
     */
@ExceptionHandler(HttpMessageNotReadableException.class)
    public ResponseEntity<Result<String>> handleHttpMessageNotReadableException(HttpMessageNotReadableException e) {
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(Result.fail(HttpStatus.BAD_REQUEST.value(), "Request body is invalid"));
    }
    /**
     * 执行handleUnauthorizedException相关处理。
     */
@ExceptionHandler(UnauthorizedException.class)
    public ResponseEntity<Result<String>> handleUnauthorizedException(UnauthorizedException e) {
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Result.fail(HttpStatus.UNAUTHORIZED.value(), e.getMessage()));
    }
    /**
     * 执行handleForbiddenException相关处理。
     */
@ExceptionHandler(ForbiddenException.class)
    public ResponseEntity<Result<String>> handleForbiddenException(ForbiddenException e) {
        return ResponseEntity.status(HttpStatus.FORBIDDEN).body(Result.fail(HttpStatus.FORBIDDEN.value(), e.getMessage()));
    }
    /**
     * 执行handleDataIntegrityViolationException相关处理。
     */
@ExceptionHandler(DataIntegrityViolationException.class)
    public ResponseEntity<Result<String>> handleDataIntegrityViolationException(DataIntegrityViolationException e) {
        log.warn("Data integrity violation", e);
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(Result.fail(HttpStatus.BAD_REQUEST.value(), "Data already exists or violates constraints"));
    }
    /**
     * 执行handleException相关处理。
     */
@ExceptionHandler(Exception.class)
    public ResponseEntity<Result<String>> handleException(Exception e) {
        log.error("Unhandled exception", e);
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(Result.fail(HttpStatus.INTERNAL_SERVER_ERROR.value(), "Internal server error"));
    }
}
