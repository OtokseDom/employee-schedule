<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Services\ReportService;
use Illuminate\Http\Request;

class DashboardReportController extends Controller
{
    /**
     * Fetch all reports in one call for dashboard.
     */
    public function dashboardReports(Request $request)
    {
        $filter = $request->all();
        $reports = [
            'tasks_by_status' => ReportService::tasksByStatus(0, "dashboard", $filter),
            'users_task_load' => ReportService::usersTaskLoad($filter),
            'estimate_vs_actual' => ReportService::estimateVsActual($filter),
            'performance_leaderboard' => ReportService::performanceLeaderboard($filter),
            'performance_rating_trend' => ReportService::performanceRatingTrend(0, "dashboard", $filter),
        ];

        $data = [];

        foreach ($reports as $key => $report) {
            $payload = $report->getData(true);
            $data[$key] = $payload['success'] ? $payload['data'] : null;
        }

        return apiResponse($data, 'Reports fetched successfully');
    }
}