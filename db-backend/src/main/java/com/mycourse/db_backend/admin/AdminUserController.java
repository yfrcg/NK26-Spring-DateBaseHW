package com.mycourse.db_backend.admin;

import java.time.LocalDateTime;
import java.util.List;
import org.springframework.data.domain.Sort;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import com.mycourse.db_backend.auth.AdminOnly;
import com.mycourse.db_backend.common.BusinessException;
import com.mycourse.db_backend.common.Result;
import com.mycourse.db_backend.user.User;
import com.mycourse.db_backend.user.UserRepository;
/**
 * 管理员用户控制器，负责接收前端请求并返回处理结果。
 */
@RestController
@AdminOnly
@RequestMapping("/api/admin/users")
public class AdminUserController {
/**
 * 用户仓库，用来访问数据库。
 */
private final UserRepository userRepository;
    /**
     * 查询users列表。
     */
@GetMapping
    public Result<List<User>> listUsers() {
        return Result.success(userRepository.findAll(Sort.by(Sort.Direction.DESC, "createdAt")));
    }
    /**
     * 执行suspend相关处理。
     */
@PostMapping("/{userId}/suspend")
    public Result<User> suspend(@PathVariable Long userId) {
        User user = userRepository.findById(userId).orElseThrow(() -> new BusinessException("User does not exist"));
        user.setAccountStatus("SUSPENDED");
        user.setUpdatedAt(LocalDateTime.now());
        return Result.success("Suspended successfully", userRepository.save(user));
    }
    /**
     * 执行activate相关处理。
     */
@PostMapping("/{userId}/activate")
    public Result<User> activate(@PathVariable Long userId) {
        User user = userRepository.findById(userId).orElseThrow(() -> new BusinessException("User does not exist"));
        user.setAccountStatus("ACTIVE");
        user.setUpdatedAt(LocalDateTime.now());
        return Result.success("Activated successfully", userRepository.save(user));
    }
/**
 * 构造AdminUserController，并注入当前类运行所需的依赖对象。
 */
public AdminUserController(final UserRepository userRepository) {
        this.userRepository = userRepository;
    }
}
