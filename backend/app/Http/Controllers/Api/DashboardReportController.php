<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;

class DashboardReportController extends Controller
{
    /**
     * Fetch all reports in one call for dashboard.
     */
    public function dashboardReports()
    {
        $reports = [
            'tasks_by_status' => $this->tasksByStatus(),
            'users_task_load' => $this->usersTaskLoad(),
            'estimate_vs_actual' => $this->estimateVsActual(),
            'performance_leaderboard' => $this->performanceLeaderboard(),
        ];

        $data = [];

        foreach ($reports as $key => $report) {
            $payload = $report->getData(true);
            $data[$key] = $payload['success'] ? $payload['data'] : null;
        }

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
                ->where('organization_id', Auth::user()->organization_id)
                ->count();
            $data[$index]['fill'] = 'var(--color-' . $status['field'] . ')';
        }
        if (empty($data)) {
            return response()->json(['message' => 'Failed to fetch task by status report', 404]);
        }
        return apiResponse($data, "Task by status report fetched successfully");
    }
    /**
     * Display report for 10 recent tasks estimate vs actual. Bar chart multiple
     */
    public function estimateVsActual()
    {
        // Fetch overall estimate and actual time
        $chart_data = DB::table('tasks')
            ->leftJoin('categories', 'categories.id', '=', 'tasks.category_id')
            ->select(
                'categories.name as category',
                DB::raw('ROUND(SUM(time_taken - time_estimate),2) as net_difference'),
                DB::raw('ROUND(SUM(CASE WHEN time_taken > time_estimate THEN time_taken - time_estimate ELSE 0 END),2) as overrun'),
                DB::raw('ROUND(SUM(CASE WHEN time_taken < time_estimate THEN time_estimate - time_taken ELSE 0 END),2) as underrun')
            )
            ->where('tasks.organization_id', Auth::user()->organization_id)
            ->groupBy('categories.name')
            ->get();

        // Prepare the data for the bar chart
        // $chart_data = [];
        $runs = [
            'over' => round($chart_data->sum('overrun'), 2),
            'under' => round($chart_data->sum('underrun'), 2),
            'net' => round($chart_data->sum('percentage_difference'), 2),
        ];

        $categoryCount = count($chart_data);

        $data = [
            'chart_data' => $chart_data,
            'runs' => $runs,
            'task_count' => $categoryCount
        ];

        if (empty($data)) {
            return response()->json(['message' => 'Failed to fetch estimate vs actual report', 404]);
        }

        return apiResponse($data, "Estimate vs actual report fetched successfully");
    }
    /**
     * Display report for users activity load. Horizontal Bar chart
     */
    public function usersTaskLoad()
    {
        $chart_data = DB::table('users')
            ->leftJoin('tasks', function ($join) {
                $join->on('users.id', '=', 'tasks.assignee_id')
                    ->where('tasks.organization_id', Auth::user()->organization_id);
            })
            ->where('users.organization_id', Auth::user()->organization_id)
            ->select(
                'users.name as user',
                DB::raw('COUNT(tasks.id) as task')
            )
            ->groupBy('users.name')
            ->get();

        // Get users with highest and lowest task load
        $highest = null;
        $lowest = null;
        foreach ($chart_data as $item) {
            if (!$highest || $item->task > $highest->task)
                $highest = $item;
            if (!$lowest || $item->task < $lowest->task)
                $lowest = $item;
        }

        $data = [
            'chart_data' => $chart_data,
            'highest' => $highest,
            'lowest' => $lowest,
            'count' => $chart_data->count()
        ];

        if (empty($data)) {
            return response()->json(['message' => 'Failed to fetch task activity timeline report', 404]);
        }

        return apiResponse($data, "Users task load report fetched successfully");
    }
    /**
     * Display report for leaderboards. Datatable
     */
    public function performanceLeaderboard()
    {
        $data = User::join('tasks', function ($join) {
            $join->on('users.id', '=', 'tasks.assignee_id')
                ->where('tasks.organization_id', Auth::user()->organization_id);
        })
            ->where('users.organization_id', Auth::user()->organization_id)
            ->select(
                'users.id',
                'name',
                'position',
                DB::raw('ROUND(AVG(tasks.performance_rating),2) as avg_performance_rating')
            )
            ->groupBy('users.id', 'name', 'position')
            ->orderByDesc('avg_performance_rating')
            ->limit(10)
            ->get();

        return apiResponse($data, "Performance leaderbord fetched successfully");
    }
}