package com.mycourse.db_backend.auth;

import java.time.LocalDateTime;
import java.util.Optional;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;
import com.mycourse.db_backend.user.User;
import com.mycourse.db_backend.user.UserRepository;
/**
 * 管理员启动初始化启动执行器，用来在系统启动时执行初始化动作。
 */
@Component
public class AdminBootstrapRunner implements ApplicationRunner {
    private static final org.slf4j.Logger log = org.slf4j.LoggerFactory.getLogger(AdminBootstrapRunner.class);
/**
 * 用户仓库，用来访问数据库。
 */
private final UserRepository userRepository;
/**
 * 密码加密器，用来进行密码哈希和密码比对。
 */
private final PasswordEncoder passwordEncoder;
    /**
     * 保存管理员用户no。
     */
@Value("${app.bootstrap.admin-user-no:admin}")
    private String adminUserNo;
    /**
     * 保存管理员密码。
     */
@Value("${app.bootstrap.admin-password:admin123456}")
    private String adminPassword;
    /**
     * 保存管理员真实名称。
     */
@Value("${app.bootstrap.admin-real-name:System Admin}")
    private String adminRealName;
    /**
     * 保存sync管理员密码。
     */
@Value("${app.bootstrap.sync-admin-password:true}")
    private boolean syncAdminPassword;
    /**
     * 在应用启动后执行初始化逻辑。
     */
@Override
    @Transactional
    public void run(ApplicationArguments args) {
        String normalizedAdminUserNo = adminUserNo.trim();
        Optional<User> existingAdminAccount = userRepository.findByUserNo(normalizedAdminUserNo);
        if (existingAdminAccount.isPresent()) {
            ensureAdminAccount(existingAdminAccount.get(), normalizedAdminUserNo);
            return;
        }
        createAdminAccount(normalizedAdminUserNo);
    }
/**
 * 确保管理员账户已经准备好；如果不存在就自动创建。
 */
private void ensureAdminAccount(User admin, String normalizedAdminUserNo) {
        LocalDateTime now = LocalDateTime.now();
        boolean updated = false;
        if (!"ADMIN".equals(admin.getUserType())) {
            admin.setUserType("ADMIN");
            updated = true;
        }
        if (!"ACTIVE".equals(admin.getAccountStatus())) {
            admin.setAccountStatus("ACTIVE");
            updated = true;
        }
        if (admin.getRealName() == null || admin.getRealName().isBlank()) {
            admin.setRealName(adminRealName);
            updated = true;
        }
        if (admin.getCreditScore() == null) {
            admin.setCreditScore(100);
            updated = true;
        }
        if (!Integer.valueOf(0).equals(admin.getIsDeleted())) {
            admin.setIsDeleted(0);
            admin.setDeletedAt(null);
            admin.setDeletedBy(null);
            updated = true;
        }
        if (syncAdminPassword || admin.getPasswordHash() == null || admin.getPasswordHash().isBlank()) {
            admin.setPasswordHash(passwordEncoder.encode(adminPassword));
            updated = true;
        }
        if (updated) {
            admin.setUpdatedAt(now);
            userRepository.save(admin);
            log.info("Ensured default admin account is available: {}", normalizedAdminUserNo);
        }
    }
/**
 * 创建管理员账户。
 */
private void createAdminAccount(String normalizedAdminUserNo) {
        LocalDateTime now = LocalDateTime.now();
        User admin = new User();
        admin.setUserNo(normalizedAdminUserNo);
        admin.setRealName(adminRealName);
        admin.setPasswordHash(passwordEncoder.encode(adminPassword));
        admin.setUserType("ADMIN");
        admin.setAccountStatus("ACTIVE");
        admin.setCreditScore(100);
        admin.setIsDeleted(0);
        admin.setCreatedAt(now);
        admin.setUpdatedAt(now);
        userRepository.save(admin);
        log.info("Bootstrapped default admin account: {}", normalizedAdminUserNo);
    }
/**
 * 构造AdminBootstrapRunner，并注入当前类运行所需的依赖对象。
 */
public AdminBootstrapRunner(final UserRepository userRepository, final PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }
}
