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
import com.mycourse.db_backend.space.Space;
import com.mycourse.db_backend.space.SpaceRepository;
/**
 * 管理员空间控制器，负责接收前端请求并返回处理结果。
 */
@RestController
@AdminOnly
@RequestMapping("/api/admin/spaces")
public class AdminSpaceController {
/**
 * 空间仓库，用来访问数据库。
 */
private final SpaceRepository spaceRepository;
    /**
     * 查询spaces列表。
     */
@GetMapping
    public Result<List<Space>> listSpaces() {
        return Result.success(spaceRepository.findAll(Sort.by(Sort.Direction.DESC, "createdAt")));
    }
    /**
     * 执行disable相关处理。
     */
@PostMapping("/{spaceId}/disable")
    public Result<Space> disable(@PathVariable Long spaceId) {
        Space space = spaceRepository.findById(spaceId).orElseThrow(() -> new BusinessException("Space does not exist"));
        space.setStatus("DISABLED");
        space.setUpdatedAt(LocalDateTime.now());
        return Result.success("Disabled successfully", spaceRepository.save(space));
    }
    /**
     * 执行activate相关处理。
     */
@PostMapping("/{spaceId}/activate")
    public Result<Space> activate(@PathVariable Long spaceId) {
        Space space = spaceRepository.findById(spaceId).orElseThrow(() -> new BusinessException("Space does not exist"));
        space.setStatus("ACTIVE");
        space.setUpdatedAt(LocalDateTime.now());
        return Result.success("Activated successfully", spaceRepository.save(space));
    }
    /**
     * 执行maintenance相关处理。
     */
@PostMapping("/{spaceId}/maintenance")
    public Result<Space> maintenance(@PathVariable Long spaceId) {
        Space space = spaceRepository.findById(spaceId).orElseThrow(() -> new BusinessException("Space does not exist"));
        space.setStatus("MAINTENANCE");
        space.setUpdatedAt(LocalDateTime.now());
        return Result.success("Marked as maintenance", spaceRepository.save(space));
    }
/**
 * 构造AdminSpaceController，并注入当前类运行所需的依赖对象。
 */
public AdminSpaceController(final SpaceRepository spaceRepository) {
        this.spaceRepository = spaceRepository;
    }
}
