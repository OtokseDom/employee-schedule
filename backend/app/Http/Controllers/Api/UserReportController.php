<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Services\ReportService;
use Illuminate\Support\Facades\DB;

class UserReportController extends Controller
{
    /**
     * Fetch all reports in one call for a user.
     */
    public function userReports($id)
    {
        if (!is_numeric($id)) {
            return apiResponse('', 'Invalid user ID', false, 400);
        }
        $user = DB::table('users')->where('id', $id)->first();
        if (!$user) {
            return apiResponse('', 'User not found', false, 404);
        }

        $reports = [
            'tasks_by_status' => ReportService::tasksByStatus($id),
            'task_activity_timeline' => ReportService::taskActivityTimeline($id),
            'rating_per_category' => ReportService::ratingPerCategory($id),
            'performance_rating_trend' => ReportService::performanceRatingTrend($id),
            'estimate_vs_actual' => ReportService::userEstimateVsActual($id),
        ];

        $data = [];

        foreach ($reports as $key => $report) {
            $payload = $report->getData(true);
            $data[$key] = $payload['success'] ? $payload['data'] : null;
        }
        return apiResponse($data, 'Reports fetched successfully');
    }
}
