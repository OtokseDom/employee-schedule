<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class DashboardReportController extends Controller
{
    /**
     * Fetch all reports in one call for dashboard.
     */
    public function dashboardReports()
    {
        $tasksByStatus = $this->tasksByStatus();
        // $taskActivityTimeline = $this->taskActivityTimeline($id);
        // $ratingPerCategory = $this->ratingPerCategory($id);
        // $performanceRatingTrend = $this->performanceRatingTrend($id);
        // $estimateVsActual = $this->estimateVsActual($id);
        $data = [
            'tasks_by_status' => $tasksByStatus->getData()
            //     'task_activity_timeline' => $taskActivityTimeline->getData(),
            //     'rating_per_category' => $ratingPerCategory->getData(),
            //     'performance_rating_trend' => $performanceRatingTrend->getData(),
            //     'estimate_vs_actual' => $estimateVsActual->getData(),
        ];
        return apiResponse($data, 'Reports fetched successfully');
    }
    /**
     * Display report for tasks by status. Donut Chart
     */
    public function tasksByStatus()
    {
        $statuses = [
            [
                'name' => 'Pending',
                'field' => 'pending',
            ],
            [
                'name' => 'In Progress',
                'field' => 'in_progress',
            ],
            [
                'name' => 'Completed',
                'field' => 'completed',
            ],
            [
                'name' => 'Delayed',
                'field' => 'delayed',
            ],
            [
                'name' => 'Cancelled',
                'field' => 'cancelled',
            ],
            [
                'name' => 'On Hold',
                'field' => 'on_hold',
            ],
        ];
        $data = [];
        foreach ($statuses as $index => $status) {
            $data[$index]['status'] = $status['field'];
            $data[$index]['tasks'] = DB::table('tasks')
                ->where('status', $status['name'])
                ->count();
            $data[$index]['fill'] = 'var(--color-' . $status['field'] . ')';
        }
        if (empty($data)) {
            return response()->json(['message' => 'Failed to fetch task by status report', 404]);
        }
        return apiResponse($data, "Task by status report fetched successfully");
    }
}
