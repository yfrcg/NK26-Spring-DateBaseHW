package com.mycourse.db_backend.report;

import java.util.List;
/**
 * 报表服务接口，用来定义对外提供的业务能力。
 */
public interface ReportService {
/**
 * 获取仪表盘。
 */
DashboardVO getDashboard();
/**
 * 获取热门spaces。
 */
List<TopSpaceVO> getTopSpaces(int limit);
/**
 * 获取信用事件stats。
 */
List<CreditEventStatVO> getCreditEventStats();
}
