package com.mycourse.db_backend.user;

import java.util.List;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import com.mycourse.db_backend.auth.AccessGuard;
import com.mycourse.db_backend.auth.AdminOnly;
import com.mycourse.db_backend.common.Result;
import jakarta.validation.Valid;
/**
 * 用户控制器，负责接收前端请求并返回处理结果。
 */
@RestController
@RequestMapping("/api/users")
public class UserController {
/**
 * 用户服务，用来复用相关业务逻辑。
 */
private final UserService userService;
/**
 * 保存访问控制。
 */
private final AccessGuard accessGuard;
    /**
     * 创建用户。
     */
@AdminOnly
    @PostMapping
    public Result<User> createUser(@RequestBody @Valid UserCreateRequest request) {
        return Result.success("Created successfully", userService.createUser(request));
    }
    /**
     * 查询users列表。
     */
@AdminOnly
    @GetMapping
    public Result<List<User>> listUsers() {
        return Result.success(userService.listUsers());
    }
    /**
     * 获取byID。
     */
@GetMapping("/{id}")
    public Result<User> getById(@PathVariable Long id) {
        accessGuard.requireSelfOrAdmin(id);
        return Result.success(userService.getById(id));
    }
/**
 * 构造UserController，并注入当前类运行所需的依赖对象。
 */
public UserController(final UserService userService, final AccessGuard accessGuard) {
        this.userService = userService;
        this.accessGuard = accessGuard;
    }
}
