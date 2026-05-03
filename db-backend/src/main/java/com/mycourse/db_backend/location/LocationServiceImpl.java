package com.mycourse.db_backend.location;

import java.time.LocalDateTime;
import java.util.ArrayDeque;
import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import com.mycourse.db_backend.common.BusinessException;
import com.mycourse.db_backend.space.Space;
import com.mycourse.db_backend.space.SpaceRepository;
/**
 * 位置服务实现类，负责落实具体业务规则。
 */
@Service
public class LocationServiceImpl implements LocationService {
/**
 * 位置仓库，用来访问数据库。
 */
private final LocationRepository locationRepository;
/**
 * 空间仓库，用来访问数据库。
 */
private final SpaceRepository spaceRepository;
    /**
     * 创建位置。
     */
@Override
    @Transactional
    public Location createLocation(LocationCreateRequest request) {
        if (locationRepository.existsByLocationCode(request.getLocationCode())) {
            throw new BusinessException("Location code already exists");
        }
        if (!request.getCloseTime().isAfter(request.getOpenTime())) {
            throw new BusinessException("Close time must be later than open time");
        }
        if (request.getParentLocationId() != null) {
            locationRepository.findById(request.getParentLocationId()).orElseThrow(() -> new BusinessException("Parent location does not exist"));
        }
        LocalDateTime now = LocalDateTime.now();
        Location location = new Location();
        location.setParentLocationId(request.getParentLocationId());
        location.setLocationCode(request.getLocationCode());
        location.setLocationName(request.getLocationName());
        location.setLocationType(request.getLocationType());
        location.setFloorNo(request.getFloorNo());
        location.setRoomNo(request.getRoomNo());
        location.setOpenTime(request.getOpenTime());
        location.setCloseTime(request.getCloseTime());
        location.setStatus("ACTIVE");
        location.setRemarks(request.getRemarks());
        location.setCreatedAt(now);
        location.setUpdatedAt(now);
        location.setIsDeleted(0);
        return locationRepository.save(location);
    }
    /**
     * 获取位置树。
     */
@Override
    public List<LocationTreeVO> getLocationTree() {
        List<Location> locations = locationRepository.findByIsDeletedOrderByLocationIdAsc(0);
        Map<Long, LocationTreeVO> map = new LinkedHashMap<>();
        List<LocationTreeVO> roots = new ArrayList<>();
        for (Location location : locations) {
            LocationTreeVO vo = new LocationTreeVO();
            vo.setLocationId(location.getLocationId());
            vo.setParentLocationId(location.getParentLocationId());
            vo.setLocationCode(location.getLocationCode());
            vo.setLocationName(location.getLocationName());
            vo.setLocationType(location.getLocationType());
            vo.setFloorNo(location.getFloorNo());
            vo.setRoomNo(location.getRoomNo());
            vo.setStatus(location.getStatus());
            map.put(location.getLocationId(), vo);
        }
        for (Location location : locations) {
            LocationTreeVO current = map.get(location.getLocationId());
            if (location.getParentLocationId() == null) {
                roots.add(current);
                continue;
            }
            LocationTreeVO parent = map.get(location.getParentLocationId());
            if (parent != null) {
                parent.getChildren().add(current);
            } else {
                roots.add(current);
            }
        }
        return roots;
    }
    /**
     * 查询spacesby位置列表。
     */
@Override
    public List<Space> listSpacesByLocation(Long locationId) {
        locationRepository.findById(locationId).orElseThrow(() -> new BusinessException("Location does not exist"));
        List<Long> locationIds = new ArrayList<>();
        ArrayDeque<Long> queue = new ArrayDeque<>();
        queue.add(locationId);
        while (!queue.isEmpty()) {
            Long currentLocationId = queue.removeFirst();
            locationIds.add(currentLocationId);
            locationRepository.findByParentLocationIdAndIsDeleted(currentLocationId, 0).forEach(child -> queue.addLast(child.getLocationId()));
        }
        return spaceRepository.findByLocationIdInAndIsDeletedOrderBySortNoAsc(locationIds, 0);
    }
/**
 * 构造LocationServiceImpl，并注入当前类运行所需的依赖对象。
 */
public LocationServiceImpl(final LocationRepository locationRepository, final SpaceRepository spaceRepository) {
        this.locationRepository = locationRepository;
        this.spaceRepository = spaceRepository;
    }
}
