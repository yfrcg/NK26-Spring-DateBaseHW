package com.mycourse.db_backend.location;

import java.util.List;

import com.mycourse.db_backend.space.Space;
/**
 * 位置服务接口，用来定义对外提供的业务能力。
 */
public interface LocationService {
/**
 * 创建位置。
 */
Location createLocation(LocationCreateRequest request);
/**
 * 获取位置树。
 */
List<LocationTreeVO> getLocationTree();
/**
 * 查询spacesby位置列表。
 */
List<Space> listSpacesByLocation(Long locationId);
}
