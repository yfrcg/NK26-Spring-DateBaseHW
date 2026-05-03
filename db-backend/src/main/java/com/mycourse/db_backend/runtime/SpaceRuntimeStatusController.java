package com.mycourse.db_backend.runtime;

import java.util.List;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import com.mycourse.db_backend.common.Result;
/**
 * 空间运行状态控制器，负责接收前端请求并返回处理结果。
 */
@RestController
@RequestMapping("/api/runtime/spaces")
public class SpaceRuntimeStatusController {
/**
 * 空间运行状态仓库，用来访问数据库。
 */
private final SpaceRuntimeStatusRepository spaceRuntimeStatusRepository;
    /**
     * 查询all列表。
     */
@GetMapping
    public Result<List<SpaceRuntimeStatus>> listAll() {
        return Result.success(spaceRuntimeStatusRepository.findAll());
    }
/**
 * 构造SpaceRuntimeStatusController，并注入当前类运行所需的依赖对象。
 */
public SpaceRuntimeStatusController(final SpaceRuntimeStatusRepository spaceRuntimeStatusRepository) {
        this.spaceRuntimeStatusRepository = spaceRuntimeStatusRepository;
    }
}
