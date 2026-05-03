package com.mycourse.db_backend.location;

import java.util.List;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import com.mycourse.db_backend.auth.AdminOnly;
import com.mycourse.db_backend.common.Result;
import com.mycourse.db_backend.space.Space;
import jakarta.validation.Valid;
/**
 * 位置控制器，负责接收前端请求并返回处理结果。
 */
@RestController
@RequestMapping("/api/locations")
public class LocationController {
/**
 * 位置服务，用来复用相关业务逻辑。
 */
private final LocationService locationService;
    /**
     * 获取树。
     */
@GetMapping("/tree")
    public Result<List<LocationTreeVO>> getTree() {
        return Result.success(locationService.getLocationTree());
    }
    /**
     * 查询spacesby位置列表。
     */
@GetMapping("/{locationId}/spaces")
    public Result<List<Space>> listSpacesByLocation(@PathVariable Long locationId) {
        return Result.success(locationService.listSpacesByLocation(locationId));
    }
    /**
     * 创建位置。
     */
@AdminOnly
    @PostMapping
    public Result<Location> createLocation(@RequestBody @Valid LocationCreateRequest request) {
        return Result.success("Created successfully", locationService.createLocation(request));
    }
/**
 * 构造LocationController，并注入当前类运行所需的依赖对象。
 */
public LocationController(final LocationService locationService) {
        this.locationService = locationService;
    }
}
