package com.mycourse.db_backend.scheduler;

import java.time.LocalDateTime;
import java.util.List;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;
import com.mycourse.db_backend.credit.CreditService;
import com.mycourse.db_backend.reservation.Reservation;
import com.mycourse.db_backend.reservation.ReservationRepository;
import com.mycourse.db_backend.reservation.SpaceTimeLock;
import com.mycourse.db_backend.reservation.SpaceTimeLockRepository;
import com.mycourse.db_backend.runtime.SpaceRuntimeStatus;
import com.mycourse.db_backend.runtime.SpaceRuntimeStatusRepository;
import com.mycourse.db_backend.session.UsageSession;
import com.mycourse.db_backend.session.UsageSessionRepository;
import com.mycourse.db_backend.session.UsageSessionService;
/**
 * 定时监控类，负责自动扫描爽约和暂离超时场景。
 */
@Component
public class ReservationMonitorScheduler {
    private static final org.slf4j.Logger log = org.slf4j.LoggerFactory.getLogger(ReservationMonitorScheduler.class);
/**
 * 预约仓库，用来访问数据库。
 */
private final ReservationRepository reservationRepository;
/**
 * usage会话仓库，用来访问数据库。
 */
private final UsageSessionRepository usageSessionRepository;
/**
 * 空间时间lock仓库，用来访问数据库。
 */
private final SpaceTimeLockRepository spaceTimeLockRepository;
/**
 * 空间运行状态仓库，用来访问数据库。
 */
private final SpaceRuntimeStatusRepository runtimeStatusRepository;
/**
 * 信用服务，用来复用相关业务逻辑。
 */
private final CreditService creditService;
/**
 * usage会话服务，用来复用相关业务逻辑。
 */
private final UsageSessionService usageSessionService;
    /**
     * 扫描超时未签到的预约，并自动标记为爽约。
     */
@Scheduled(cron = "0 */2 * * * *")
    @Transactional
    public void scanNoShowReservations() {
        LocalDateTime deadline = LocalDateTime.now().minusMinutes(15);
        List<Reservation> reservations = reservationRepository.findByReservationStatusAndStartTimeBefore("CONFIRMED", deadline);
        for (Reservation reservation : reservations) {
            UsageSession session = usageSessionRepository.findByReservationId(reservation.getReservationId()).orElse(null);
            if (session != null && session.getCheckInTime() != null) {
                continue;
            }
            LocalDateTime now = LocalDateTime.now();
            reservation.setReservationStatus("NO_SHOW");
            reservation.setCancelReason("Marked automatically by the system: no show");
            reservation.setCancelTime(now);
            reservation.setUpdatedAt(now);
            reservationRepository.save(reservation);
            List<SpaceTimeLock> locks = spaceTimeLockRepository.findByReservationId(reservation.getReservationId());
            for (SpaceTimeLock lock : locks) {
                lock.setLockStatus("EXPIRED");
                lock.setUpdatedAt(now);
            }
            spaceTimeLockRepository.saveAll(locks);
            SpaceRuntimeStatus runtime = runtimeStatusRepository.findById(reservation.getSpaceId()).orElse(null);
            if (runtime != null) {
                runtime.setCurrentStatus("IDLE");
                runtime.setCurrentReservationId(null);
                runtime.setCurrentSessionId(null);
                runtime.setHoldExpireTime(null);
                runtime.setStatusSince(now);
                runtime.setUpdatedAt(now);
                runtimeStatusRepository.save(runtime);
            }
            creditService.deductForNoShow(reservation, null);
        }
    }
    /**
     * 扫描暂离超时的会话，并触发异常结束处理。
     */
@Scheduled(cron = "0 * * * * *")
    public void scanExpiredTempHoldSessions() {
        LocalDateTime now = LocalDateTime.now();
        List<UsageSession> sessions = usageSessionRepository.findBySessionStatusAndHoldExpireTimeBefore("TEMP_HOLD", now);
        for (UsageSession session : sessions) {
            try {
                usageSessionService.markHoldTimeout(session.getReservationId());
            } catch (Exception e) {
                log.warn("Failed to mark temp hold timeout for reservation {}", session.getReservationId(), e);
            }
        }
    }
/**
 * 构造ReservationMonitorScheduler，并注入当前类运行所需的依赖对象。
 */
public ReservationMonitorScheduler(final ReservationRepository reservationRepository, final UsageSessionRepository usageSessionRepository, final SpaceTimeLockRepository spaceTimeLockRepository, final SpaceRuntimeStatusRepository runtimeStatusRepository, final CreditService creditService, final UsageSessionService usageSessionService) {
        this.reservationRepository = reservationRepository;
        this.usageSessionRepository = usageSessionRepository;
        this.spaceTimeLockRepository = spaceTimeLockRepository;
        this.runtimeStatusRepository = runtimeStatusRepository;
        this.creditService = creditService;
        this.usageSessionService = usageSessionService;
    }
}
