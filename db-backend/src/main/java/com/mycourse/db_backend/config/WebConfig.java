package com.mycourse.db_backend.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.InterceptorRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;
import com.mycourse.db_backend.auth.AuthInterceptor;
/**
 * Web配置类，负责注册相关的 Spring 组件。
 */
@Configuration
public class WebConfig implements WebMvcConfigurer {
/**
 * 保存认证interceptor。
 */
private final AuthInterceptor authInterceptor;
    /**
     * 执行addInterceptors相关处理。
     */
@Override
    public void addInterceptors(InterceptorRegistry registry) {
        registry.addInterceptor(authInterceptor).addPathPatterns("/api/**");
    }
/**
 * 构造WebConfig，并注入当前类运行所需的依赖对象。
 */
public WebConfig(final AuthInterceptor authInterceptor) {
        this.authInterceptor = authInterceptor;
    }
}
