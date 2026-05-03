package com.mycourse.db_backend.user;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Set;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import com.mycourse.db_backend.common.BusinessException;
/**
 * 用户服务实现类，负责落实具体业务规则。
 */
@Service
public class UserServiceImpl implements UserService {
    private static final Set<String> ALLOWED_USER_TYPES = Set.of("STUDENT", "TEACHER", "ADMIN");
/**
 * 用户仓库，用来访问数据库。
 */
private final UserRepository userRepository;
/**
 * 密码加密器，用来进行密码哈希和密码比对。
 */
private final PasswordEncoder passwordEncoder;
    /**
     * 创建用户。
     */
@Override
    @Transactional
    public User createUser(UserCreateRequest request) {
        String userNo = request.getUserNo().trim();
        if (userRepository.findByUserNo(userNo).isPresent()) {
            throw new BusinessException("User number already exists");
        }
        String phone = normalizeNullable(request.getPhone());
        if (phone != null && userRepository.existsByPhone(phone)) {
            throw new BusinessException("Phone number already exists");
        }
        String email = normalizeNullable(request.getEmail());
        if (email != null && userRepository.existsByEmail(email)) {
            throw new BusinessException("Email already exists");
        }
        LocalDateTime now = LocalDateTime.now();
        User user = new User();
        user.setUserNo(userNo);
        user.setRealName(request.getRealName().trim());
        user.setPhone(phone);
        user.setEmail(email);
        user.setPasswordHash(passwordEncoder.encode(request.getPassword()));
        user.setUserType(normalizeUserType(request.getUserType()));
        user.setAccountStatus("ACTIVE");
        user.setCreditScore(100);
        user.setIsDeleted(0);
        user.setCreatedAt(now);
        user.setUpdatedAt(now);
        return userRepository.save(user);
    }
    /**
     * 查询users列表。
     */
@Override
    public List<User> listUsers() {
        return userRepository.findByIsDeletedOrderByCreatedAtDesc(0);
    }
    /**
     * 获取byID。
     */
@Override
    public User getById(Long id) {
        User user = userRepository.findById(id).orElseThrow(() -> new BusinessException("User does not exist"));
        if (Integer.valueOf(1).equals(user.getIsDeleted())) {
            throw new BusinessException("User has been deleted");
        }
        return user;
    }
/**
 * 规范化用户类型内容。
 */
private String normalizeUserType(String rawUserType) {
        if (rawUserType == null || rawUserType.isBlank()) {
            return "STUDENT";
        }
        String normalized = rawUserType.trim().toUpperCase();
        if (!ALLOWED_USER_TYPES.contains(normalized)) {
            throw new BusinessException("Unsupported user type");
        }
        return normalized;
    }
/**
 * 规范化nullable内容。
 */
private String normalizeNullable(String value) {
        if (value == null) {
            return null;
        }
        String normalized = value.trim();
        return normalized.isEmpty() ? null : normalized;
    }
/**
 * 构造UserServiceImpl，并注入当前类运行所需的依赖对象。
 */
public UserServiceImpl(final UserRepository userRepository, final PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }
}
