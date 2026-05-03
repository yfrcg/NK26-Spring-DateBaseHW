package com.mycourse.db_backend.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
/**
 * 安全支持配置类，负责注册相关的 Spring 组件。
 */
@Configuration
public class SecuritySupportConfig {
    /**
     * 执行passwordEncoder相关处理。
     */
@Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }
}
