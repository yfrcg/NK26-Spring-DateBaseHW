package com.mycourse.db_backend.reservation;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
/**
 * 空间时间lock仓库接口，负责访问数据库中的相关数据。
 */
public interface SpaceTimeLockRepository extends JpaRepository<SpaceTimeLock, Long> {

    @Query("""
        select case when count(l) > 0 then true else false end
        from SpaceTimeLock l
        where l.spaceId = :spaceId
          and l.lockStatus = 'ACTIVE'
          and l.lockStartTime < :endTime
          and l.lockEndTime > :startTime
    """)
    boolean existsActiveConflict(@Param("spaceId") Long spaceId,
/**
 * 按照预约ID查询数据。
 */
                                 @Param("startTime") LocalDateTime startTime,
                                 @Param("endTime") LocalDateTime endTime);
List<SpaceTimeLock> findByReservationId(Long reservationId);
}
