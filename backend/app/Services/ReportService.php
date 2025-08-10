<?php

namespace App\Services;

use App\Http\Resources\TaskHistoryResource;
use App\Models\Category;
use App\Models\Task;
use App\Models\TaskHistory;
use App\Models\User;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;

class ReportService
{

    protected Task $task;
    protected TaskHistory $task_history;
    protected Category $category;
    protected User $user;
    protected $organization_id;
    public function __construct(Task $task, TaskHistory $task_history, Category $category, User $user)
    {
        $this->task = $task;
        $this->task_history = $task_history;
        $this->category = $category;
        $this->user = $user;
        $this->organization_id = Auth::user()->organization_id;
    }
    /* ----------------------------- SHARED REPORTS ----------------------------- */

    /**
     * Display reports for section cards. Section Cards
     */
    public function overallProgress($id = null, $filter)
    {
        $progress_query = $this->task->where('organization_id', $this->organization_id);

        if ($id) {
            $progress_query->where('assignee_id', $id);
        }
        if ($filter && $filter['from'] && $filter['to']) {
            $progress_query->whereBetween('start_date', [$filter['from'], $filter['to']]);
        }
        if ($filter && isset($filter['projects'])) {
            $projectIds = explode(',', $filter['projects']); // turns "10,9" into [10, 9]
            $progress_query->whereIn('project_id', $projectIds);
        }
        if ($filter && isset($filter['users'])) {
            $userIds = explode(',', $filter['users']); // turns "10,9" into [10, 9]
            $progress_query->whereIn('assignee_id', $userIds);
        }
        // Total tasks excluding cancelled
        $totalTasks = (clone $progress_query)->where('status', '!=', 'cancelled')->count();
        // Completed tasks count
        $completedTasks = (clone $progress_query)->where('status', 'completed')->count();

        $progress = $totalTasks > 0
            ? round(($completedTasks / $totalTasks) * 100, 2)
            : 0;

        $data = [
            'progress' => $progress,
        ];

        if (empty($data)) {
            return apiResponse(null, 'Failed to fetch progress', false, 404);
        }

        return apiResponse($data, "Progress report fetched successfully");
    }
    /**
     * Display reports for section cards. Section Cards
     */
    public function sectionCards($id = null, $filter)
    {
        /* ------------------------- // Average Performance ------------------------- */
        $avg_performance_query = $this->task->where('organization_id', $this->organization_id);

        if ($id) {
            $avg_performance_query->where('assignee_id', $id);
        }
        if ($filter && $filter['from'] && $filter['to']) {
            $avg_performance_query->whereBetween('start_date', [$filter['from'], $filter['to']]);
        }
        if ($filter && isset($filter['projects'])) {
            $projectIds = explode(',', $filter['projects']); // turns "10,9" into [10, 9]
            $avg_performance_query->whereIn('project_id', $projectIds);
        }
        if ($filter && isset($filter['users'])) {
            $userIds = explode(',', $filter['users']); // turns "10,9" into [10, 9]
            $avg_performance_query->whereIn('assignee_id', $userIds);
        }
        $avg_performance = $avg_performance_query->avg('performance_rating');
        /* ----------------------------- // Task at Risk ---------------------------- */
        $task_at_risk_query = $this->task
            ->where('status', '!=', 'completed')
            ->where('organization_id', $this->organization_id)
            ->where('end_date', '<=', now()->addDays(3))
            ->where('end_date', '>=', now());
        if ($id) {
            $task_at_risk_query->where('assignee_id', $id);
        }
        if ($filter && $filter['from'] && $filter['to']) {
            $task_at_risk_query->whereBetween('start_date', [$filter['from'], $filter['to']]);
        }
        if ($filter && isset($filter['projects'])) {
            $projectIds = explode(',', $filter['projects']); // turns "10,9" into [10, 9]
            $task_at_risk_query->whereIn('project_id', $projectIds);
        }
        if ($filter && isset($filter['users'])) {
            $userIds = explode(',', $filter['users']); // turns "10,9" into [10, 9]
            $task_at_risk_query->whereIn('assignee_id', $userIds);
        }
        $task_at_risk = $task_at_risk_query->count();
        /* ----------------------- // Average Completion Time ----------------------- */
        $avg_completion_time = $this->task
            ->where('status', 'completed')
            ->where('organization_id', $this->organization_id)
            ->avg('time_taken');
        /* --------------------------- // Time Efficiency --------------------------- */
        $time_efficiency_query = $this->task
            ->where('status', 'completed')
            ->where('organization_id', $this->organization_id);
        if ($id) {
            $time_efficiency_query->where('assignee_id', $id);
        }
        if ($filter && $filter['from'] && $filter['to']) {
            $time_efficiency_query->whereBetween('start_date', [$filter['from'], $filter['to']]);
        }
        if ($filter && isset($filter['projects'])) {
            $projectIds = explode(',', $filter['projects']); // turns "10,9" into [10, 9]
            $time_efficiency_query->whereIn('project_id', $projectIds);
        }
        if ($filter && isset($filter['users'])) {
            $userIds = explode(',', $filter['users']); // turns "10,9" into [10, 9]
            $time_efficiency_query->whereIn('assignee_id', $userIds);
        }
        $time_efficiency = $time_efficiency_query->avg(DB::raw('time_estimate / time_taken * 100'));
        /* ------------------------- // Task Completion Rate ------------------------ */
        $task_completion_query = $this->task
            ->where('organization_id', $this->organization_id);
        if ($id) {
            $task_completion_query->where('assignee_id', $id);
        }
        if ($filter && $filter['from'] && $filter['to']) {
            $task_completion_query->whereBetween('start_date', [$filter['from'], $filter['to']]);
        }
        if ($filter && isset($filter['projects'])) {
            $projectIds = explode(',', $filter['projects']); // turns "10,9" into [10, 9]
            $task_completion_query->whereIn('project_id', $projectIds);
        }
        if ($filter && isset($filter['users'])) {
            $userIds = explode(',', $filter['users']); // turns "10,9" into [10, 9]
            $task_completion_query->whereIn('assignee_id', $userIds);
        }
        $total_tasks = (clone $task_completion_query)->count();
        $completed_tasks = (clone $task_completion_query)
            ->where('status', 'Completed')
            ->count();
        $completion_rate = $total_tasks > 0 ? ($completed_tasks / $total_tasks) * 100 : 0;

        $data = [
            // 'user_count' => $user_count,
            'avg_performance' => round($avg_performance, 2),
            'task_at_risk' => $task_at_risk,
            'avg_completion_time' => round($avg_completion_time, 2),
            'time_efficiency' => round($time_efficiency, 2),
            'completion_rate' => round($completion_rate, 2),
        ];
        if (empty($data)) {
            return apiResponse(null, 'Failed to fetch active users report', false, 404);
        }

        return apiResponse($data, "Active users report fetched successfully");
    }
    // Task status - Pie donut chart
    public function tasksByStatus($id, $variant = "", $filter)
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
                'name' => 'For Review',
                'field' => 'for_review',
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
        $chart_data = [];
        foreach ($statuses as $index => $status) {
            $chart_data[$index]['status'] = $status['field'];
            $query = $this->task
                ->where('organization_id', $this->organization_id)
                ->where('status', $status['name']);
            if ($filter && $filter['from'] && $filter['to']) {
                $query->whereBetween('start_date', [$filter['from'], $filter['to']]);
            }
            if ($filter && isset($filter['projects'])) {
                $projectIds = explode(',', $filter['projects']); // turns "10,9" into [10, 9]
                $query->whereIn('project_id', $projectIds);
            }
            if ($filter && isset($filter['users']) && $variant === 'dashboard') {
                $userIds = explode(',', $filter['users']); // turns "10,9" into [10, 9]
                $query->whereIn('assignee_id', $userIds);
            }
            if ($id && $variant !== 'dashboard') {
                $query->where('assignee_id', $id);
            }
            $chart_data[$index]['tasks'] = $query->count();
            $chart_data[$index]['fill'] = 'var(--color-' . $status['field'] . ')';
        }
        // return response($data);
        $data = [
            'chart_data' => $chart_data,
        ];

        if (empty($data)) {
            return apiResponse(null, 'Failed to fetch task by status report', false, 404);
        }
        return apiResponse($data, "Task by status report fetched successfully");
    }

    // Performance Trend - Line chart label
    public function performanceRatingTrend($id, $variant = "", $filter)
    {

        // Calculate the last 6 months (including current)
        $months = [];
        // Use filter['to'] as the starting month, default to current month if not set
        $startDate = isset($filter['to']) ? \Carbon\Carbon::parse($filter['to'])->startOfMonth() : now()->startOfMonth();
        for ($i = 5; $i >= 0; $i--) {
            $date = $startDate->copy()->subMonths($i);
            $months[] = [
                'year' => $date->year,
                'month' => $date->format('F'),
                'month_num' => $date->month,
            ];
        }

        $chart_data = [];
        $task_count = 0;
        foreach ($months as $m) {
            $query = $this->task
                ->whereYear('start_date', $m['year'])
                ->whereMonth('start_date', $m['month_num'])
                ->where('organization_id', $this->organization_id);
            if ($filter && $filter['from'] && $filter['to']) {
                $query->whereBetween('start_date', [$filter['from'], $filter['to']]);
            }
            if ($filter && isset($filter['projects'])) {
                $projectIds = explode(',', $filter['projects']); // turns "10,9" into [10, 9]
                $query->whereIn('project_id', $projectIds);
            }
            if ($filter && isset($filter['users']) && $variant === 'dashboard') {
                $userIds = explode(',', $filter['users']); // turns "10,9" into [10, 9]
                $query->whereIn('assignee_id', $userIds);
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
            'task_count' => $task_count,
        ];

        if (empty($data['chart_data'])) {
            return apiResponse(null, 'Failed to fetch task activity timeline report', false, 404);
        }

        return apiResponse($data, "Performance rating trend report fetched successfully");
    }

    /* ------------------------------ USER REPORTS ------------------------------ */
    // User Assigned Tasks
    public function userTasks($id, $filter)
    {
        $query = $this->task->with(['assignee:id,name,email,role,position', 'category', 'project:id,title'])
            ->orderBy('id', 'DESC')
            ->where('assignee_id', $id)
            ->where('organization_id', $this->organization_id);

        if ($filter && $filter['from'] && $filter['to']) {
            $query->whereBetween('start_date', [$filter['from'], $filter['to']]);
        }
        if ($filter && isset($filter['projects'])) {
            $projectIds = explode(',', $filter['projects']); // turns "10,9" into [10, 9]
            $query->whereIn('project_id', $projectIds);
        }

        $userTasks = $query->get();
        $taskIds = $userTasks->pluck('id');

        $task_history = $this->task_history->with(['task:id,title', 'changedBy:id,name,email'])
            ->where('organization_id', $this->organization_id)
            ->whereIn('task_id', $taskIds)
            ->orderBy('id', 'ASC')->get();

        $data = [
            'data' => $userTasks,
            'task_history' => TaskHistoryResource::collection($task_history),
        ];
        if (empty($data)) {
            return apiResponse(null, 'No tasks assigned to this user', false, 404);
        }

        return apiResponse($data, 'User assigned tasks fetched successfully');
    }
    // User Taskload. Area chart
    public function taskActivityTimeline($id, $filter)
    {
        // Calculate the last 6 months (including current)
        $months = [];
        // Use filter['to'] as the starting month, default to current month if not set
        $startDate = isset($filter['to']) ? \Carbon\Carbon::parse($filter['to'])->startOfMonth() : now()->startOfMonth();
        for ($i = 5; $i >= 0; $i--) {
            $date = $startDate->copy()->subMonths($i);
            $months[] = [
                'year' => $date->year,
                'month' => $date->format('F'),
                'month_num' => $date->month,
            ];
        }

        $chart_data = [];
        $task_count = 0;
        foreach ($months as $m) {
            $query = $this->task
                ->where('assignee_id', $id)
                ->where('organization_id', $this->organization_id)
                ->whereYear('start_date', $m['year'])
                ->whereMonth('start_date', $m['month_num']);

            if ($filter && $filter['from'] && $filter['to']) {
                $query->whereBetween('start_date', [$filter['from'], $filter['to']]);
            }
            if ($filter && isset($filter['projects'])) {
                $projectIds = explode(',', $filter['projects']); // turns "10,9" into [10, 9]
                $query->whereIn('project_id', $projectIds);
            }
            $count = $query->count();

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
            'task_count' => $task_count,
        ];

        if (empty($data['chart_data'])) {
            return apiResponse(null, 'Failed to fetch task activity timeline report', false, 404);
        }

        return apiResponse($data, "Task activity timeline report fetched successfully");
    }
    // Average Rating Per Category. Radar chart
    public function ratingPerCategory($id, $filter)
    {
        $query = $this->category
            ->leftJoin('tasks', function ($join) use ($id, $filter) {
                $join->on('tasks.category_id', '=', 'categories.id')
                    ->where('tasks.assignee_id', '=', $id);

                if ($filter && $filter['from'] && $filter['to']) {
                    $join->whereBetween('tasks.start_date', [$filter['from'], $filter['to']]);
                }
                if ($filter && isset($filter['projects'])) {
                    $projectIds = explode(',', $filter['projects']); // turns "10,9" into [10, 9]
                    $join->whereIn('project_id', $projectIds);
                }
            })
            ->where('categories.organization_id', $this->organization_id);

        $ratings = $query->select(
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
            "task_count" => $task_count,
            "filters" => $filter
        ];
        if (empty($data)) {
            return apiResponse(null, 'Failed to fetch rating per category report', false, 404);
        }

        return apiResponse($data, "Rating per category report fetched successfully");
    }
    /**
     * Display report for 10 recent tasks estimate vs actual. Bar chart multiple
     */
    public function userEstimateVsActual($id, $filter)
    {
        // Fetch the 10 most recent tasks for the user
        $query = $this->task
            ->where('assignee_id', $id)
            ->where('organization_id', $this->organization_id);
        if ($filter && $filter['from'] && $filter['to']) {
            $query->whereBetween('start_date', [$filter['from'], $filter['to']]);
        }
        if ($filter && isset($filter['projects'])) {
            $projectIds = explode(',', $filter['projects']); // turns "10,9" into [10, 9]
            $query->whereIn('project_id', $projectIds);
        }
        $tasks = $query->orderBy('start_date', 'desc')
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
            'task_count' => $taskCount,
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
    public function usersTaskLoad($filter)
    {
        $query = $this->user
            ->leftJoin('tasks', function ($join) {
                $join->on('users.id', '=', 'tasks.assignee_id')
                    ->where('tasks.organization_id', $this->organization_id);
            })
            ->where('users.organization_id', $this->organization_id);
        if ($filter && $filter['from'] && $filter['to']) {
            $query->whereBetween('start_date', [$filter['from'], $filter['to']]);
        }
        if ($filter && isset($filter['projects'])) {
            $projectIds = explode(',', $filter['projects']); // turns "10,9" into [10, 9]
            $query->whereIn('project_id', $projectIds);
        }
        if ($filter && isset($filter['users'])) {
            $userIds = explode(',', $filter['users']); // turns "10,9" into [10, 9]
            $query->whereIn('assignee_id', $userIds);
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
            'count' => $chart_data->count(),
        ];

        if (empty($data)) {
            return apiResponse(null, 'Failed to fetch task activity timeline report', false, 404);
        }

        return apiResponse($data, "Users task load report fetched successfully");
    }
    /**
     * Display report for leaderboards. Datatable
     */
    public function performanceLeaderboard($filter)
    {
        $query = $this->user->join('tasks', function ($join) {
            $join->on('users.id', '=', 'tasks.assignee_id')
                ->where('tasks.organization_id', $this->organization_id);
        })
            ->where('users.organization_id', $this->organization_id);
        if ($filter && $filter['from'] && $filter['to']) {
            $query->whereBetween('start_date', [$filter['from'], $filter['to']]);
        }
        if ($filter && isset($filter['projects'])) {
            $projectIds = explode(',', $filter['projects']); // turns "10,9" into [10, 9]
            $query->whereIn('project_id', $projectIds);
        }
        if ($filter && isset($filter['users'])) {
            $userIds = explode(',', $filter['users']); // turns "10,9" into [10, 9]
            $query->whereIn('assignee_id', $userIds);
        }
        $chart_data = $query->select(
            'users.id',
            'name',
            'position',
            DB::raw('ROUND(AVG(tasks.performance_rating),2) as avg_performance_rating')
        )
            ->groupBy('users.id', 'name', 'position')
            ->orderByDesc('avg_performance_rating')
            ->limit(10)
            ->get();

        $data = [
            'chart_data' => $chart_data,
        ];

        if (empty($data)) {
            return apiResponse(null, 'Failed to fetch performance leaderboard report', false, 404);
        }

        return apiResponse($data, "Performance leaderbord fetched successfully");
    }

    // estimate vs actual. Bar chart multiple
    public function estimateVsActual($filter)
    {
        // Fetch overall estimate and actual time
        $query = $this->task
            ->leftJoin('categories', 'categories.id', '=', 'tasks.category_id')
            ->select(
                'categories.name as category',
                DB::raw('ROUND(SUM(time_taken - time_estimate),2) as net_difference'),
                DB::raw('ROUND(SUM(CASE WHEN time_taken > time_estimate THEN time_taken - time_estimate ELSE 0 END),2) as overrun'),
                DB::raw('ROUND(SUM(CASE WHEN time_taken < time_estimate THEN time_estimate - time_taken ELSE 0 END),2) as underrun')
            )
            ->where('tasks.organization_id', $this->organization_id);
        if ($filter && $filter['from'] && $filter['to']) {
            $query->whereBetween('start_date', [$filter['from'], $filter['to']]);
        }
        if ($filter && isset($filter['projects'])) {
            $projectIds = explode(',', $filter['projects']); // turns "10,9" into [10, 9]
            $query->whereIn('project_id', $projectIds);
        }
        if ($filter && isset($filter['users'])) {
            $userIds = explode(',', $filter['users']); // turns "10,9" into [10, 9]
            $query->whereIn('assignee_id', $userIds);
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
            'task_count' => $categoryCount,
        ];

        if (empty($data)) {
            return apiResponse(null, 'Failed to fetch estimate vs actual report', false, 404);
        }

        return apiResponse($data, "Estimate vs actual report fetched successfully");
    }
}
