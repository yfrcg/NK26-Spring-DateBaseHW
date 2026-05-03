package com.mycourse.db_backend;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling;
/**
 * 启动类，负责启动整个 Spring Boot 后端应用。
 */
@SpringBootApplication
@EnableScheduling
public class DbBackendApplication {
/**
 * 执行main相关处理。
 */
public static void main(String[] args) {
        SpringApplication.run(DbBackendApplication.class, args);
    }
}
