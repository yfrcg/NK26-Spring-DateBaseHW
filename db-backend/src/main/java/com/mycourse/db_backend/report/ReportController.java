package com.mycourse.db_backend.report;

import java.util.List;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import com.mycourse.db_backend.common.Result;
/**
 * 报表控制器，负责接收前端请求并返回处理结果。
 */
@RestController
@RequestMapping("/api/reports")
public class ReportController {
/**
 * 报表服务，用来复用相关业务逻辑。
 */
private final ReportService reportService;
    /**
     * 执行dashboard相关处理。
     */
@GetMapping("/dashboard")
    public Result<DashboardVO> dashboard() {
        return Result.success(reportService.getDashboard());
    }
    /**
     * 执行topSpaces相关处理。
     */
@GetMapping("/top-spaces")
    public Result<List<TopSpaceVO>> topSpaces(@RequestParam(defaultValue = "5") Integer limit) {
        return Result.success(reportService.getTopSpaces(limit));
    }
    /**
     * 执行creditEvents相关处理。
     */
@GetMapping("/credit-events")
    public Result<List<CreditEventStatVO>> creditEvents() {
        return Result.success(reportService.getCreditEventStats());
    }
/**
 * 构造ReportController，并注入当前类运行所需的依赖对象。
 */
public ReportController(final ReportService reportService) {
        this.reportService = reportService;
    }
}
