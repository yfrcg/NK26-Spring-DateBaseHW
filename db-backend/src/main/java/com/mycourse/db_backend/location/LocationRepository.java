package com.mycourse.db_backend.location;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
/**
 * 位置仓库接口，负责访问数据库中的相关数据。
 */
public interface LocationRepository extends JpaRepository<Location, Long> {
/**
 * 判断位置编码是否存在。
 */
boolean existsByLocationCode(String locationCode);
/**
 * 按照is删除orderby位置IDasc查询数据。
 */
List<Location> findByIsDeletedOrderByLocationIdAsc(Integer isDeleted);
/**
 * 按照parent位置IDandis删除查询数据。
 */
List<Location> findByParentLocationIdAndIsDeleted(Long parentLocationId, Integer isDeleted);
}
