<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Services\ReportService;

class DashboardReportController extends Controller
{
    /**
     * Fetch all reports in one call for dashboard.
     */
    public function dashboardReports()
    {
        $reports = [
            'tasks_by_status' => ReportService::tasksByStatus(0, "dashboard"),
            'users_task_load' => ReportService::usersTaskLoad(),
            'estimate_vs_actual' => ReportService::estimateVsActual(),
            'performance_leaderboard' => ReportService::performanceLeaderboard(),
            'performance_rating_trend' => ReportService::performanceRatingTrend(0, "dashboard"),
        ];

        $data = [];

        foreach ($reports as $key => $report) {
            $payload = $report->getData(true);
            $data[$key] = $payload['success'] ? $payload['data'] : null;
        }

        return apiResponse($data, 'Reports fetched successfully');
    }
}
