package com.mycourse.db_backend.auth;

import java.time.LocalDateTime;
import java.util.Set;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import com.mycourse.db_backend.common.BusinessException;
import com.mycourse.db_backend.common.UnauthorizedException;
import com.mycourse.db_backend.user.User;
import com.mycourse.db_backend.user.UserCreateRequest;
import com.mycourse.db_backend.user.UserRepository;
import com.mycourse.db_backend.user.UserService;
/**
 * 认证服务实现类，负责落实具体业务规则。
 */
@Service
public class AuthServiceImpl implements AuthService {
    private static final Set<String> SELF_REGISTER_USER_TYPES = Set.of("STUDENT", "TEACHER");
/**
 * 用户仓库，用来访问数据库。
 */
private final UserRepository userRepository;
/**
 * 用户服务，用来复用相关业务逻辑。
 */
private final UserService userService;
/**
 * 密码加密器，用来进行密码哈希和密码比对。
 */
private final PasswordEncoder passwordEncoder;
/**
 * 认证令牌服务，用来复用相关业务逻辑。
 */
private final AuthTokenService authTokenService;
    /**
     * 处理登录逻辑，并在成功后返回新的登录令牌。
     */
@Override
    @Transactional
    public AuthResponse login(LoginRequest request) {
        User user = userRepository.findByUserNo(request.getUserNo().trim()).orElseThrow(() -> new UnauthorizedException("Invalid credentials"));
        if (Integer.valueOf(1).equals(user.getIsDeleted())) {
            throw new UnauthorizedException("User does not exist");
        }
        if ("SUSPENDED".equals(user.getAccountStatus())) {
            throw new UnauthorizedException("Current account has been suspended");
        }
        if (!matchesPassword(user, request.getPassword())) {
            throw new UnauthorizedException("Invalid credentials");
        }
        user.setLastLoginTime(LocalDateTime.now());
        user.setUpdatedAt(LocalDateTime.now());
        User saved = userRepository.save(user);
        AuthenticatedUser authenticatedUser = authTokenService.createSession(saved);
        return new AuthResponse(authenticatedUser.token(), saved);
    }
    /**
     * 处理注册逻辑，并在成功后直接创建登录会话。
     */
@Override
    @Transactional
    public AuthResponse register(RegisterRequest request) {
        UserCreateRequest createRequest = new UserCreateRequest();
        createRequest.setUserNo(request.getUserNo());
        createRequest.setRealName(request.getRealName());
        createRequest.setPhone(request.getPhone());
        createRequest.setEmail(request.getEmail());
        createRequest.setPassword(request.getPassword());
        createRequest.setUserType(normalizeRegisterUserType(request.getUserType()));
        User user = userService.createUser(createRequest);
        user.setLastLoginTime(LocalDateTime.now());
        user.setUpdatedAt(LocalDateTime.now());
        User saved = userRepository.save(user);
        AuthenticatedUser authenticatedUser = authTokenService.createSession(saved);
        return new AuthResponse(authenticatedUser.token(), saved);
    }
    /**
     * 获取当前令牌对应的用户信息。
     */
@Override
    public User getCurrentUser() {
        AuthenticatedUser authenticatedUser = AuthContext.getCurrentUser();
        return userRepository.findById(authenticatedUser.userId()).orElseThrow(() -> new UnauthorizedException("Current user does not exist"));
    }
    /**
     * 修改当前登录用户的密码。
     */
@Override
    @Transactional
    public User changePassword(ChangePasswordRequest request) {
        User user = getCurrentUser();
        if (!passwordEncoder.matches(request.getCurrentPassword(), user.getPasswordHash())) {
            throw new BusinessException("Current password is incorrect");
        }
        if (request.getCurrentPassword().equals(request.getNewPassword())) {
            throw new BusinessException("New password must be different from the current password");
        }
        user.setPasswordHash(passwordEncoder.encode(request.getNewPassword()));
        user.setUpdatedAt(LocalDateTime.now());
        return userRepository.save(user);
    }
    /**
     * 退出当前登录会话。
     */
@Override
    public void logout() {
        authTokenService.revoke(AuthContext.getCurrentUser().token());
    }
/**
 * 规范化register用户类型内容。
 */
private String normalizeRegisterUserType(String userType) {
        if (userType == null || userType.isBlank()) {
            return "STUDENT";
        }
        String normalized = userType.trim().toUpperCase();
        if (!SELF_REGISTER_USER_TYPES.contains(normalized)) {
            throw new BusinessException("Self registration only supports student or teacher accounts");
        }
        return normalized;
    }
/**
 * 执行matchesPassword相关处理。
 */
private boolean matchesPassword(User user, String password) {
        String passwordHash = user.getPasswordHash();
        if (passwordHash == null || passwordHash.isBlank()) {
            if (!user.getUserNo().equals(password)) {
                return false;
            }
            user.setPasswordHash(passwordEncoder.encode(password));
            return true;
        }
        return passwordEncoder.matches(password, passwordHash);
    }
/**
 * 构造AuthServiceImpl，并注入当前类运行所需的依赖对象。
 */
public AuthServiceImpl(final UserRepository userRepository, final UserService userService, final PasswordEncoder passwordEncoder, final AuthTokenService authTokenService) {
        this.userRepository = userRepository;
        this.userService = userService;
        this.passwordEncoder = passwordEncoder;
        this.authTokenService = authTokenService;
    }
}
