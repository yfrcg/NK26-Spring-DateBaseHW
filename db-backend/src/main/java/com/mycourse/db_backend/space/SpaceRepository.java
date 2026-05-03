package com.mycourse.db_backend.space;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
/**
 * 空间仓库接口，负责访问数据库中的相关数据。
 */
public interface SpaceRepository extends JpaRepository<Space, Long> {
/**
 * 按照状态andis删除查询数据。
 */
List<Space> findByStatusAndIsDeleted(String status, Integer isDeleted);
/**
 * 按照位置IDandis删除orderby排序noasc查询数据。
 */
List<Space> findByLocationIdAndIsDeletedOrderBySortNoAsc(Long locationId, Integer isDeleted);
/**
 * 按照位置ID签到andis删除orderby排序noasc查询数据。
 */
List<Space> findByLocationIdInAndIsDeletedOrderBySortNoAsc(List<Long> locationIds, Integer isDeleted);
}
