package com.mycourse.db_backend.auth;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import com.mycourse.db_backend.common.Result;
import com.mycourse.db_backend.user.User;
import jakarta.validation.Valid;
/**
 * 认证控制器，负责接收前端请求并返回处理结果。
 */
@RestController
@RequestMapping("/api/auth")
public class AuthController {
/**
 * 认证服务，用来复用相关业务逻辑。
 */
private final AuthService authService;
    /**
     * 处理登录逻辑，并在成功后返回新的登录令牌。
     */
@PublicApi
    @PostMapping("/login")
    public Result<AuthResponse> login(@RequestBody @Valid LoginRequest request) {
        return Result.success("Login successful", authService.login(request));
    }
    /**
     * 处理注册逻辑，并在成功后直接创建登录会话。
     */
@PublicApi
    @PostMapping("/register")
    public Result<AuthResponse> register(@RequestBody @Valid RegisterRequest request) {
        return Result.success("Registration successful", authService.register(request));
    }
    /**
     * 执行me相关处理。
     */
@GetMapping("/me")
    public Result<User> me() {
        return Result.success(authService.getCurrentUser());
    }
    /**
     * 修改当前登录用户的密码。
     */
@PostMapping("/change-password")
    public Result<User> changePassword(@RequestBody @Valid ChangePasswordRequest request) {
        return Result.success("Password updated", authService.changePassword(request));
    }
    /**
     * 退出当前登录会话。
     */
@PostMapping("/logout")
    public Result<Void> logout() {
        authService.logout();
        return Result.success("Logout successful", null);
    }
/**
 * 构造AuthController，并注入当前类运行所需的依赖对象。
 */
public AuthController(final AuthService authService) {
        this.authService = authService;
    }
}
