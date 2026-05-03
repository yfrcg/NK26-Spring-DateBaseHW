package com.mycourse.db_backend.space;

import java.util.List;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import com.mycourse.db_backend.common.Result;
/**
 * 空间控制器，负责接收前端请求并返回处理结果。
 */
@RestController
@RequestMapping("/api/spaces")
public class SpaceController {
/**
 * 空间仓库，用来访问数据库。
 */
private final SpaceRepository spaceRepository;
    /**
     * 查询启用spaces列表。
     */
@GetMapping("/active")
    public Result<List<Space>> listActiveSpaces() {
        return Result.success(spaceRepository.findByStatusAndIsDeleted("ACTIVE", 0));
    }
/**
 * 构造SpaceController，并注入当前类运行所需的依赖对象。
 */
public SpaceController(final SpaceRepository spaceRepository) {
        this.spaceRepository = spaceRepository;
    }
}
