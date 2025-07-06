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
        $usersTaskLoad = $this->usersTaskLoad();
        // $ratingPerCategory = $this->ratingPerCategory();
        // $performanceRatingTrend = $this->performanceRatingTrend();
        $estimateVsActual = $this->estimateVsActual();
        $data = [
            'tasks_by_status' => $tasksByStatus->getData()->data,
            'users_task_load' => $usersTaskLoad->getData()->data,
            //     'rating_per_category' => $ratingPerCategory->getData()->data,
            //     'performance_rating_trend' => $performanceRatingTrend->getData()->data,
            'estimate_vs_actual' => $estimateVsActual->getData()->data,
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
    /**
     * Display report for 10 recent tasks estimate vs actual. Bar chart multiple
     */
    public function estimateVsActual()
    {
        // Fetch overall estimate and actual time
        $tasks = DB::table('tasks')
            ->leftJoin('categories', 'categories.id', '=', 'tasks.category_id')
            ->select(
                'categories.name as category',
                DB::raw('SUM(time_estimate) as total_estimate'),
                DB::raw('SUM(time_taken) as total_taken')
            )
            ->groupBy('categories.name')
            ->get();

        // Prepare the data for the bar chart
        $chart_data = [];
        $runs = [
            'over' => null,
            'under' => null,
            'exact' => 0
        ];
        foreach ($tasks as $index => $task) {
            $chart_data[] = [
                'task' => $task->category, //category for dashboard - task for user report
                'estimate' => round($task->total_estimate, 2),
                'actual' => round($task->total_taken, 2),
                'percentage_difference' => 0
            ];

            // Calculate percentage difference for each task/category
            $chart_data[$index]['percentage_difference'] = round($chart_data[$index]['estimate'] - $chart_data[$index]['actual'], 2);
            if (mb_strlen($chart_data[$index]['task']) > 15) {
                $chart_data[$index]['task'] = mb_substr($chart_data[$index]['task'], 0, 15) . '...' . " (" . $chart_data[$index]['percentage_difference'] . ")";
            } else {
                $chart_data[$index]['task'] = $chart_data[$index]['task'] . " (" . $chart_data[$index]['percentage_difference'] . ")";
            }

            // Get total underruns and overruns
            if ($chart_data[$index]['percentage_difference'] < 0) {
                $runs['over'] += $chart_data[$index]['percentage_difference'];
                $runs['over'] = round($runs['over'], 2);
            } elseif ($chart_data[$index]['percentage_difference'] > 0) {
                $runs['under'] += $chart_data[$index]['percentage_difference'];
                $runs['under'] = round($runs['under'], 2);
            }
        }

        $taskCount = count($chart_data);

        $data = [
            'chart_data' => $chart_data,
            'runs' => $runs,
            'task_count' => $taskCount
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
        $chart_data = DB::table('tasks')
            ->leftJoin('users', 'users.id', '=', 'tasks.assignee_id')
            ->select(
                'users.name as user',
                DB::raw('COUNT(tasks.id) as task'),
            )
            ->groupBy('user')
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
}