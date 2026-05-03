package com.mycourse.db_backend.user;

import java.util.List;
/**
 * 用户服务接口，用来定义对外提供的业务能力。
 */
public interface UserService {
/**
 * 创建用户。
 */
User createUser(UserCreateRequest request);
/**
 * 查询users列表。
 */
List<User> listUsers();
/**
 * 获取byID。
 */
User getById(Long id);
}
