<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class UserReportController extends Controller
{
    /**
     * Fetch all reports in one call for a user.
     */
    public function userReports($id)
    {
        if (!is_numeric($id)) {
            return response()->json(['error' => 'Invalid user ID'], 400);
        }
        $user = DB::table('users')->where('id', $id)->first();
        if (!$user) {
            return response()->json(['error' => 'User not found'], 404);
        }
        $tasksByStatus = $this->tasksByStatus($id);
        $taskActivityTimeline = $this->taskActivityTimeline($id);
        $ratingPerCategory = $this->ratingPerCategory($id);
        $performanceRatingTrend = $this->performanceRatingTrend($id);
        $estimateVsActual = $this->estimateVsActual($id);
        $data = [
            'tasks_by_status' => $tasksByStatus->getData(),
            'task_activity_timeline' => $taskActivityTimeline->getData(),
            'rating_per_category' => $ratingPerCategory->getData(),
            'performance_rating_trend' => $performanceRatingTrend->getData(),
            'estimate_vs_actual' => $estimateVsActual->getData(),
        ];
        return apiResponse($data, 'Reports fetched successfully');
    }
    /**
     * Display report for tasks by status. Donut Chart
     */
    public function tasksByStatus($id)
    {
        if (!is_numeric($id)) {
            return response()->json(['error' => 'Invalid user ID'], 400);
        }
        $pending = DB::table('tasks')
            ->where('assignee_id', $id)
            ->where('status', 'Pending')
            ->count();
        $in_progress = DB::table('tasks')
            ->where('assignee_id', $id)
            ->where('status', 'In Progress')
            ->count();
        $completed = DB::table('tasks')
            ->where('assignee_id', $id)
            ->where('status', 'Completed')
            ->count();
        $delayed = DB::table('tasks')
            ->where('assignee_id', $id)
            ->where('status', 'delayed')
            ->count();
        $cancelled = DB::table('tasks')
            ->where('assignee_id', $id)
            ->where('status', 'Cancelled')
            ->count();
        $on_hold = DB::table('tasks')
            ->where('assignee_id', $id)
            ->where('status', 'On Hold')
            ->count();
        $data = [
            [
                'status' => 'pending',
                'tasks' => $pending,
                'fill' => 'var(--color-pending)',
            ],
            [
                'status' => 'in_progress',
                'tasks' => $in_progress,
                'fill' => 'var(--color-in_progress)',
            ],
            [
                'status' => 'completed',
                'tasks' => $completed,
                'fill' => 'var(--color-completed)',
            ],
            [
                'status' => 'delayed',
                'tasks' => $delayed,
                'fill' => 'var(--color-delayed)',
            ],
            [
                'status' => 'cancelled',
                'tasks' => $cancelled,
                'fill' => 'var(--color-cancelled)',
            ],
            [
                'status' => 'on_hold',
                'tasks' => $on_hold,
                'fill' => 'var(--color-on_hold)',
            ]
        ];
        // return response($data);

        if (empty($data)) {
            return response()->json(['message' => 'Failed to fetch task by status report', 404]);
        }
        return apiResponse($data, "Task by status report fetched successfully");
    }
    /**
     * Display report for tasks timeline to see users activity load. Area chart
     */
    public function taskActivityTimeline($id)
    {
        // Calculate the last 6 months (including current)
        $months = [];
        for ($i = 5; $i >= 0; $i--) {
            $date = now()->startOfMonth()->subMonths($i);
            $months[] = [
                'year' => $date->year,
                'month' => $date->format('F'),
                'month_num' => $date->month,
            ];
        }

        $chart_data = [];
        foreach ($months as $m) {
            $count = DB::table('tasks')
                ->where('assignee_id', $id)
                ->whereYear('start_date', $m['year'])
                ->whereMonth('start_date', $m['month_num'])
                ->count();
            $chart_data[] = [
                'year' => $m['year'],
                'month' => $m['month'],
                'tasks' => $count,
            ];
        }

        // Calculate percentage difference (current vs previous month)
        $month1 = $chart_data[5]['tasks'];
        $month2 = $chart_data[4]['tasks'];
        $percentageDifference = [
            'value' => ($month2 != 0)
                ? round(abs((($month1 - $month2) / $month2) * 100), 2)
                : ($month1 > 0 ? 100 : 0),
            'event' => $month1 > $month2 ? 'Increased' : ($month1 < $month2 ? 'Decreased' : 'Same'),
        ];

        $data = [
            'percentage_difference' => $percentageDifference,
            'chart_data' => $chart_data
        ];

        if (empty($data['chart_data'])) {
            return response()->json(['message' => 'Failed to fetch task activity timeline report', 404]);
        }

        return apiResponse($data, "Task activity timeline report fetched successfully");
    }
    /**
     * Display report for tasks by Average Rating Per Category. Radar chart
     */
    public function ratingPerCategory($id)
    {
        $ratings = DB::table('categories')
            ->leftJoin('tasks', function ($join) use ($id) {
                $join->on('tasks.category_id', '=', 'categories.id')
                    ->where('tasks.assignee_id', '=', $id);
            })
            ->select('categories.name as category', DB::raw('AVG(tasks.performance_rating) as average_rating'))
            ->groupBy('categories.id', 'categories.name')
            ->get()
            ->map(function ($item) {
                return [
                    'category' => $item->category,
                    'value' => is_null($item->average_rating) ? 0 : round($item->average_rating, 2)
                ];
            });
        $highestRatingValue = $ratings->max('value');
        $highestRatingCategory = $ratings->firstWhere('value', $highestRatingValue);
        $highestRating = [
            'category' => $highestRatingCategory ? $highestRatingCategory['category'] : null,
            'value' => $highestRatingValue
        ];
        $data = [
            "highest_rating" => $highestRating,
            "ratings" => $ratings
        ];
        if (empty($data)) {
            return response()->json(['message' => 'Failed to fetch rating per category report', 404]);
        }

        return apiResponse($data, "Rating per category report fetched successfully");
    }
    /**
     * Display report for tasks timeline to see users activity load. Area chart
     */
    public function performanceRatingTrend($id)
    {
        // Calculate the last 6 months (including current)
        $months = [];
        for ($i = 5; $i >= 0; $i--) {
            $date = now()->startOfMonth()->subMonths($i);
            $months[] = [
                'year' => $date->year,
                'month' => $date->format('F'),
                'month_num' => $date->month,
            ];
        }

        $chart_data = [];
        foreach ($months as $m) {
            $rating = DB::table('tasks')
                ->where('assignee_id', $id)
                ->whereYear('start_date', $m['year'])
                ->whereMonth('start_date', $m['month_num'])
                ->avg('performance_rating');
            $chart_data[] = [
                'year' => $m['year'],
                'month' => $m['month'],
                'rating' => round($rating, 2),
            ];
        }

        // Calculate percentage difference (current vs previous month)
        $month1 = $chart_data[5]['rating'];
        $month2 = $chart_data[4]['rating'];
        $percentageDifference = [
            'value' => ($month2 != 0)
                ? round(abs((($month1 - $month2) / $month2) * 100), 2)
                : ($month1 > 0 ? 100 : 0),
            'event' => $month1 > $month2 ? 'Increased' : ($month1 < $month2 ? 'Decreased' : 'Same'),
        ];

        $data = [
            'percentage_difference' => $percentageDifference,
            'chart_data' => $chart_data
        ];

        if (empty($data['chart_data'])) {
            return response()->json(['message' => 'Failed to fetch task activity timeline report', 404]);
        }

        return apiResponse($data, "Performance rating trend report fetched successfully");
    }
    /**
     * Display report for 10 recent tasks estimate vs actual. Bar chart multiple
     */
    public function estimateVsActual($id)
    {
        // Fetch the 10 most recent tasks for the user
        $tasks = DB::table('tasks')
            ->where('assignee_id', $id)
            ->orderBy('start_date', 'desc')
            ->take(10)
            ->get(['title', 'time_estimate', 'time_taken', 'start_date']);

        // Prepare the data for the bar chart
        $chart_data = [];
        $runs = [
            'over' => null,
            'under' => null,
            'exact' => 0
        ];
        foreach ($tasks as $index => $task) {
            $chart_data[] = [
                'task' => $task->title,
                'estimate' => round($task->time_estimate, 2),
                'actual' => round($task->time_taken, 2),
                'percentage_difference' => 0
            ];

            // Calculate percentage difference for each task
            $chart_data[$index]['percentage_difference'] = round($chart_data[$index]['estimate'] - $chart_data[$index]['actual'], 2);
            if (mb_strlen($chart_data[$index]['task']) > 15) {
                $chart_data[$index]['task'] = mb_substr($chart_data[$index]['task'], 0, 15) . '...' . " (" . abs($chart_data[$index]['percentage_difference']) . ")";
            } else {
                $chart_data[$index]['task'] = $chart_data[$index]['task'] . " (" . $chart_data[$index]['percentage_difference'] . ")";
            }

            // Get total underruns and overruns
            if ($chart_data[$index]['percentage_difference'] > 0)
                $runs['over'] += $chart_data[$index]['percentage_difference'];
            elseif ($chart_data[$index]['percentage_difference'] < 0)
                $runs['under'] += $chart_data[$index]['percentage_difference'];
            else
                $runs['exact']++;
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
}