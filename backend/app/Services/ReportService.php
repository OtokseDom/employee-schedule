<?php

namespace App\Services;

use App\Models\User;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
// TODO: Add Filter
// TODO: Add excel export
class ReportService
{
    /* ----------------------------- SHARED REPORTS ----------------------------- */
    // Task status - Pie donut chart
    public static function tasksByStatus($id, $variant = "", $filter)
    {
        if (!is_numeric($id) && $variant == "") {
            return apiResponse(null, 'Invalid user ID', false, 400);
            // return response()->json(['error' => 'Invalid user ID'], 400);
        }

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
            $query = DB::table('tasks')
                ->where('organization_id', Auth::user()->organization_id)
                ->where('status', $status['name']);

            if ($filter && $filter['from'] && $filter['to']) {
                $query->where('tasks.start_date', '>=', $filter['from'])
                    ->where('tasks.start_date', '<=', $filter['to']);
            }

            if ($variant !== 'dashboard') {
                $query->where('assignee_id', $id);
            }

            $data[$index]['tasks'] = $query->count();
            $data[$index]['fill'] = 'var(--color-' . $status['field'] . ')';
        }
        // return response($data);

        if (empty($data)) {
            return apiResponse(null, 'Failed to fetch task by status report', false, 404);
        }
        return apiResponse($data, "Task by status report fetched successfully");
    }

    // Performance Trend - Line chart label
    public static function performanceRatingTrend($id, $variant = "", $filter)
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
        $task_count = 0;
        foreach ($months as $m) {
            $query = DB::table('tasks')
                ->whereYear('start_date', $m['year'])
                ->whereMonth('start_date', $m['month_num'])
                ->where('organization_id', Auth::user()->organization_id);

            if ($filter && $filter['from'] && $filter['to']) {
                $query->where('tasks.start_date', '>=', $filter['from'])
                    ->where('tasks.start_date', '<=', $filter['to']);
            }

            if ($variant !== 'dashboard') {
                $query->where('assignee_id', $id);
            }

            $rating = $query->select(
                DB::raw('AVG(performance_rating) as average_rating'),
                DB::raw('COUNT(id) as task_count')
            )->first();

            $chart_data[] = [
                'year' => $m['year'],
                'month' => $m['month'],
                'rating' => round($rating->average_rating, 2),
            ];
            $task_count += $rating->task_count ?? 0;
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
            'chart_data' => $chart_data,
            'task_count' => $task_count
        ];

        if (empty($data['chart_data'])) {
            return apiResponse(null, 'Failed to fetch task activity timeline report', false, 404);
        }

        return apiResponse($data, "Performance rating trend report fetched successfully");
    }

    /* ------------------------------ USER REPORTS ------------------------------ */
    // User Taskload. Area chart
    public static function taskActivityTimeline($id, $filter)
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
        $task_count = 0;
        foreach ($months as $m) {
            $count = DB::table('tasks')
                ->where('assignee_id', $id)
                ->where('organization_id', Auth::user()->organization_id)
                ->whereYear('start_date', $m['year'])
                ->whereMonth('start_date', $m['month_num'])
                ->count();

            $chart_data[] = [
                'year' => $m['year'],
                'month' => $m['month'],
                'tasks' => $count,
            ];
            $task_count = $task_count + $count;
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
            'chart_data' => $chart_data,
            'task_count' => $task_count
        ];

        if (empty($data['chart_data'])) {
            return apiResponse(null, 'Failed to fetch task activity timeline report', false, 404);
        }

        return apiResponse($data, "Task activity timeline report fetched successfully");
    }
    // Average Rating Per Category. Radar chart
    public static function ratingPerCategory($id, $filter)
    {
        $ratings = DB::table('categories')
            ->leftJoin('tasks', function ($join) use ($id) {
                $join->on('tasks.category_id', '=', 'categories.id')
                    ->where('tasks.assignee_id', '=', $id);
            })
            ->where('categories.organization_id', Auth::user()->organization_id)
            ->select(
                'categories.name as category',
                DB::raw('AVG(tasks.performance_rating) as average_rating'),
                DB::raw('COUNT(tasks.id) as task_count')
            )
            ->groupBy('categories.id', 'categories.name')
            ->get()
            ->map(function ($item) {
                return [
                    'category' => $item->category,
                    'value' => is_null($item->average_rating) ? 0 : round($item->average_rating, 2),
                    'task_count' => $item->task_count
                ];
            });
        $task_count = $ratings->sum('task_count');
        $highestRatingValue = $ratings->max('value');
        $highestRatingCategory = $ratings->firstWhere('value', $highestRatingValue);
        $highestRating = [
            'category' => $highestRatingCategory ? $highestRatingCategory['category'] : null,
            'value' => $highestRatingValue
        ];
        $data = [
            "highest_rating" => $highestRating,
            "ratings" => $ratings,
            "task_count" => $task_count
        ];
        if (empty($data)) {
            return apiResponse(null, 'Failed to fetch rating per category report', false, 404);
        }

        return apiResponse($data, "Rating per category report fetched successfully");
    }
    /**
     * Display report for 10 recent tasks estimate vs actual. Bar chart multiple
     */
    public static function userEstimateVsActual($id, $filter)
    {
        // Fetch the 10 most recent tasks for the user
        $tasks = DB::table('tasks')
            ->where('assignee_id', $id)
            ->where('organization_id', Auth::user()->organization_id)
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
                'net_difference' => 0
            ];

            // Calculate percentage difference for each task
            $chart_data[$index]['net_difference'] = round($chart_data[$index]['estimate'] - $chart_data[$index]['actual'], 2);
            if (mb_strlen($chart_data[$index]['task']) > 15) {
                $chart_data[$index]['task'] = mb_substr($chart_data[$index]['task'], 0, 15) . '...' . " (" . $chart_data[$index]['net_difference'] . ")";
            } else {
                $chart_data[$index]['task'] = $chart_data[$index]['task'] . " (" . $chart_data[$index]['net_difference'] . ")";
            }

            // Get total underruns and overruns
            if ($chart_data[$index]['net_difference'] < 0) {
                $runs['over'] += $chart_data[$index]['net_difference'];
                $runs['over'] = round($runs['over'], 2);
            } elseif ($chart_data[$index]['net_difference'] > 0) {
                $runs['under'] += $chart_data[$index]['net_difference'];
                $runs['under'] = round($runs['under'], 2);
            } else
                $runs['exact']++;
        }

        $taskCount = count($chart_data);

        $data = [
            'chart_data' => $chart_data,
            'runs' => $runs,
            'task_count' => $taskCount
        ];

        if (empty($data)) {
            return apiResponse(null, 'Failed to fetch estimate vs actual report', false, 404);
        }

        return apiResponse($data, "Estimate vs actual report fetched successfully");
    }

    /* ---------------------------- DASHBOARD REPORTS --------------------------- */

    /**
     * Display report for users activity load. Horizontal Bar chart
     */
    public static function usersTaskLoad($filter)
    {
        $query = DB::table('users')
            ->leftJoin('tasks', function ($join) {
                $join->on('users.id', '=', 'tasks.assignee_id')
                    ->where('tasks.organization_id', Auth::user()->organization_id);
            })
            ->where('users.organization_id', Auth::user()->organization_id);

        if ($filter && $filter['from'] && $filter['to']) {
            $query->where('tasks.start_date', '>=', $filter['from'])
                ->where('tasks.start_date', '<=', $filter['to']);
        }

        $chart_data = $query->select(
            'users.name as user',
            DB::raw('COUNT(tasks.id) as task')
        )
            ->groupBy('users.name')->get();

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
            return apiResponse(null, 'Failed to fetch task activity timeline report', false, 404);
        }

        return apiResponse($data, "Users task load report fetched successfully");
    }
    /**
     * Display report for leaderboards. Datatable
     */
    public static function performanceLeaderboard($filter)
    {
        $query = User::join('tasks', function ($join) {
            $join->on('users.id', '=', 'tasks.assignee_id')
                ->where('tasks.organization_id', Auth::user()->organization_id);
        })
            ->where('users.organization_id', Auth::user()->organization_id);



        if ($filter && $filter['from'] && $filter['to']) {
            $query->where('tasks.start_date', '>=', $filter['from'])
                ->where('tasks.start_date', '<=', $filter['to']);
        }

        $data = $query->select(
            'users.id',
            'name',
            'position',
            DB::raw('ROUND(AVG(tasks.performance_rating),2) as avg_performance_rating')
        )
            ->groupBy('users.id', 'name', 'position')
            ->orderByDesc('avg_performance_rating')
            ->limit(10)
            ->get();

        if (empty($data)) {
            return apiResponse(null, 'Failed to fetch performance leaderboard report', false, 404);
        }

        return apiResponse($data, "Performance leaderbord fetched successfully");
    }

    // estimate vs actual. Bar chart multiple
    public static function estimateVsActual($filter)
    {
        // Fetch overall estimate and actual time
        $query = DB::table('tasks')
            ->leftJoin('categories', 'categories.id', '=', 'tasks.category_id')
            ->select(
                'categories.name as category',
                DB::raw('ROUND(SUM(time_taken - time_estimate),2) as net_difference'),
                DB::raw('ROUND(SUM(CASE WHEN time_taken > time_estimate THEN time_taken - time_estimate ELSE 0 END),2) as overrun'),
                DB::raw('ROUND(SUM(CASE WHEN time_taken < time_estimate THEN time_estimate - time_taken ELSE 0 END),2) as underrun')
            )
            ->where('tasks.organization_id', Auth::user()->organization_id);

        if ($filter && $filter['from'] && $filter['to']) {
            $query->where('tasks.start_date', '>=', $filter['from'])
                ->where('tasks.start_date', '<=', $filter['to']);
        }

        $chart_data = $query->groupBy('categories.name')
            ->get();

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
            return apiResponse(null, 'Failed to fetch estimate vs actual report', false, 404);
        }

        return apiResponse($data, "Estimate vs actual report fetched successfully");
    }
}