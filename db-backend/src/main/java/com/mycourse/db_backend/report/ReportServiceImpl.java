package com.mycourse.db_backend.report;

import java.math.BigDecimal;
import java.math.BigInteger;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import org.springframework.stereotype.Service;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
/**
 * 报表服务实现类，负责落实具体业务规则。
 */
@Service
public class ReportServiceImpl implements ReportService {
    /**
     * 保存JPA 原生查询入口。
     */
@PersistenceContext
    private EntityManager entityManager;
    /**
     * 获取仪表盘。
     */
@Override
    public DashboardVO getDashboard() {
        LocalDateTime start = LocalDate.now().atStartOfDay();
        LocalDateTime end = start.plusDays(1);
        DashboardVO vo = new DashboardVO();
        vo.setTodayReservationCount(queryCount("SELECT COUNT(*) FROM reservations WHERE created_at >= ?1 AND created_at < ?2", start, end));
        vo.setTodayCheckInCount(queryCount("SELECT COUNT(*) FROM usage_sessions WHERE check_in_time >= ?1 AND check_in_time < ?2", start, end));
        vo.setTodayRevenue(queryDecimal("SELECT COALESCE(SUM(paid_amount), 0) FROM billing_orders WHERE bill_status = \'PAID\' AND settled_at >= ?1 AND settled_at < ?2", start, end));
        vo.setUnpaidBillCount(queryCount("SELECT COUNT(*) FROM billing_orders WHERE bill_status = \'UNPAID\'"));
        vo.setActiveUserCount(queryCount("SELECT COUNT(*) FROM users WHERE is_deleted = 0 AND account_status = \'ACTIVE\'"));
        return vo;
    }
    /**
     * 获取热门spaces。
     */
@Override
    public List<TopSpaceVO> getTopSpaces(int limit) {
        List<?> rows = entityManager.createNativeQuery("""
            SELECT s.space_id, s.space_name, COUNT(r.reservation_id) AS cnt
            FROM spaces s
            LEFT JOIN reservations r ON s.space_id = r.space_id
            WHERE s.is_deleted = 0
            GROUP BY s.space_id, s.space_name
            ORDER BY cnt DESC, s.space_id ASC
            LIMIT ?1
            """).setParameter(1, limit).getResultList();
        List<TopSpaceVO> result = new ArrayList<>();
        for (Object row : rows) {
            Object[] arr = (Object[]) row;
            TopSpaceVO vo = new TopSpaceVO();
            vo.setSpaceId(((Number) arr[0]).longValue());
            vo.setSpaceName((String) arr[1]);
            vo.setReservationCount(((Number) arr[2]).longValue());
            result.add(vo);
        }
        return result;
    }
    /**
     * 获取信用事件stats。
     */
@Override
    public List<CreditEventStatVO> getCreditEventStats() {
        List<?> rows = entityManager.createNativeQuery("""
            SELECT event_type, COUNT(*) AS cnt
            FROM credit_transactions
            GROUP BY event_type
            ORDER BY cnt DESC
            """).getResultList();
        List<CreditEventStatVO> result = new ArrayList<>();
        for (Object row : rows) {
            Object[] arr = (Object[]) row;
            CreditEventStatVO vo = new CreditEventStatVO();
            vo.setEventType((String) arr[0]);
            vo.setEventCount(((Number) arr[1]).longValue());
            result.add(vo);
        }
        return result;
    }
/**
 * 执行查询并返回数量。
 */
private Long queryCount(String sql, Object... params) {
        var query = entityManager.createNativeQuery(sql);
        for (int i = 0; i < params.length; i++) {
            query.setParameter(i + 1, params[i]);
        }
        Object value = query.getSingleResult();
        if (value instanceof BigInteger bigInteger) {
            return bigInteger.longValue();
        }
        if (value instanceof Number number) {
            return number.longValue();
        }
        return 0L;
    }
/**
 * 执行查询并返回decimal。
 */
private BigDecimal queryDecimal(String sql, Object... params) {
        var query = entityManager.createNativeQuery(sql);
        for (int i = 0; i < params.length; i++) {
            query.setParameter(i + 1, params[i]);
        }
        Object value = query.getSingleResult();
        if (value instanceof BigDecimal decimal) {
            return decimal;
        }
        if (value instanceof Number number) {
            return BigDecimal.valueOf(number.doubleValue());
        }
        return BigDecimal.ZERO;
    }
/**
 * 构造ReportServiceImpl，并注入当前类运行所需的依赖对象。
 */
public ReportServiceImpl() {
    }
}
