package com.mycourse.db_backend.runtime;

import org.springframework.data.jpa.repository.JpaRepository;
/**
 * 空间运行状态仓库接口，负责访问数据库中的相关数据。
 */
public interface SpaceRuntimeStatusRepository extends JpaRepository<SpaceRuntimeStatus, Long> {
}
