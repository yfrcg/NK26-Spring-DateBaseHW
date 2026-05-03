package com.mycourse.db_backend.user;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
/**
 * 用户仓库接口，负责访问数据库中的相关数据。
 */
public interface UserRepository extends JpaRepository<User, Long> {
/**
 * 按照用户编号查询数据。
 */
Optional<User> findByUserNo(String userNo);
/**
 * 按照is删除orderby创建atdesc查询数据。
 */
List<User> findByIsDeletedOrderByCreatedAtDesc(Integer isDeleted);
/**
 * 判断手机号是否存在。
 */
boolean existsByPhone(String phone);
/**
 * 判断邮箱地址是否存在。
 */
boolean existsByEmail(String email);
/**
 * 判断用户类型andis删除是否存在。
 */
boolean existsByUserTypeAndIsDeleted(String userType, Integer isDeleted);
}
