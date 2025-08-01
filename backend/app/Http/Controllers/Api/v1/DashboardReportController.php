<?php

namespace App\Http\Controllers\Api\v1;

use App\Http\Controllers\Controller;
use App\Services\ReportService;
use Illuminate\Http\Request;

class DashboardReportController extends Controller
{

    protected ReportService $report_service;
    public function __construct(ReportService $report_service)
    {
        $this->report_service = $report_service;
    }
    public function dashboardReports(Request $request)
    {
        $filter = $request->all();
        $reports = [
            'tasks_by_status' => $this->report_service->tasksByStatus(null, "dashboard", $filter),
            'users_task_load' => $this->report_service->usersTaskLoad($filter),
            'estimate_vs_actual' => $this->report_service->estimateVsActual($filter),
            'performance_leaderboard' => $this->report_service->performanceLeaderboard($filter),
            'performance_rating_trend' => $this->report_service->performanceRatingTrend(null, "dashboard", $filter),
            'section_cards' => $this->report_service->sectionCards(null, $filter),
        ];

        $data = [];
        // Mass check data for success response on each function
        foreach ($reports as $key => $report) {
            $payload = $report->getData(true);
            $data[$key] = $payload['success'] ? $payload['data'] : null;
        }

        return apiResponse($data, 'Reports fetched successfully');
    }
}
