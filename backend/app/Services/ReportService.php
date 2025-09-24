<?php

namespace App\Services;

use App\Http\Resources\TaskHistoryResource;
use App\Models\Category;
use App\Models\Task;
use App\Models\TaskHistory;
use App\Models\TaskStatus;
use App\Models\User;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;

class ReportService
{
    protected Task $task;
    protected TaskHistory $task_history;
    protected TaskStatus $task_status;
    protected Category $category;
    protected User $user;
    protected $organization_id;

    /* -------------------------------------------------------------------------- */
    /*                                   HELPERS                                  */
    /* -------------------------------------------------------------------------- */
    public function __construct(Task $task, TaskHistory $task_history, TaskStatus $task_status, Category $category, User $user)
    {
        $this->task = $task;
        $this->task_history = $task_history;
        $this->task_status = $task_status;
        $this->category = $category;
        $this->user = $user;
        $this->organization_id = Auth::user()->organization_id;
    }

    // Apply common filters to query builder
    private function applyFilters($query, $id, $filter)
    {
        // User ID filter
        if ($id) {
            $query->whereHas('assignees', function ($q) use ($id) {
                $q->where('users.id', $id);
            });
        }

        if (!$filter) {
            return $query;
        }

        // Multiple users filter
        if (isset($filter['users'])) {
            $userIds = explode(',', $filter['users']);
            $query->whereHas('assignees', function ($q) use ($userIds) {
                $q->whereIn('users.id', $userIds);
            });
        }

        // Date range filter
        if (!empty($filter['from']) && !empty($filter['to'])) {
            $query->whereBetween('start_date', [$filter['from'], $filter['to']]);
        }

        // Projects filter
        if (isset($filter['projects'])) {
            $projectIds = explode(',', $filter['projects']);
            $query->whereIn('project_id', $projectIds);
        }

        return $query;
    }

    /* ----------------------------- SHARED REPORTS ----------------------------- */
    // Overall Progress
    public function overallProgress($id = null, $filter)
    {
        $progress_query = $this->task
            ->where('organization_id', $this->organization_id)
            ->where(function ($query) {
                $query->whereNotNull('parent_id')->orWhere(function ($subQuery) {
                    $subQuery->whereNull('parent_id')->whereDoesntHave('children');
                });
            });
        $progress_query = $this->applyFilters($progress_query, $id, $filter);
        $cancelled = $this->task_status->where('name', 'cancelled')->where('organization_id', $this->organization_id)->value('id');
        $completed = $this->task_status->where('name', 'completed')->where('organization_id', $this->organization_id)->value('id');
        // Total tasks excluding cancelled
        $totalTasks = (clone $progress_query)->where('status_id', '!=', $cancelled)->where('status_id', '!=', null)->count();
        // Completed tasks count
        $completedTasks = (clone $progress_query)->where('status_id', $completed)->count();

        $progress = $totalTasks > 0
            ? round(($completedTasks / $totalTasks) * 100, 2)
            : 0;

        $data = [
            'progress' => $progress,
            'filters' => $filter
        ];

        if (empty($data)) {
            return apiResponse(null, 'Failed to fetch progress', false, 404);
        }

        return apiResponse($data, "Progress report fetched successfully");
    }

    // Section Cards
    public function sectionCards($id = null, $filter)
    {
        // Get completed status ID once
        $completed = $this->task_status->where('name', 'completed')
            ->where('organization_id', $this->organization_id)
            ->value('id');

        // Base query builder with common filters
        $baseQuery = $this->task->where('organization_id', $this->organization_id)
            ->where(function ($query) {
                $query->whereNotNull('parent_id')->orWhere(function ($subQuery) {
                    $subQuery->whereNull('parent_id')->whereDoesntHave('children');
                });
            });

        // Apply common filters to base query
        $baseQuery = $this->applyFilters($baseQuery, $id, $filter);

        // Clone base query for different metrics
        $avgPerformanceQuery = clone $baseQuery;
        $timeEfficiencyQuery = (clone $baseQuery)->where('status_id', $completed);
        $delayedTasksQuery = clone $baseQuery;

        // Tasks at risk query (has unique conditions)
        $taskAtRiskQuery = (clone $baseQuery)
            ->where('status_id', '!=', $completed)
            ->where('end_date', '<=', now()->addDays(3))
            ->where('end_date', '>=', now());

        // Task Completion query (has unique conditions)
        $taskCompletionQuery = 0;
        $totalTasks = (clone $baseQuery)->count();
        if ($totalTasks !== 0) {
            $completedTasks = (clone $baseQuery)->where('status_id', $completed)->count();

            $taskCompletionQuery = round(($completedTasks / $totalTasks) * 100, 2);
        }

        // Execute all queries
        $data = [
            'avg_performance' => round($avgPerformanceQuery->avg('performance_rating'), 2),
            'task_at_risk' => $taskAtRiskQuery->count(),
            'avg_completion_time' => round(
                $this->task->where('status_id', $completed)
                    ->where('organization_id', $this->organization_id)
                    ->where(function ($query) {
                        $query->whereNotNull('parent_id')->orWhere(function ($subQuery) {
                            $subQuery->whereNull('parent_id')->whereDoesntHave('children');
                        });
                    })
                    ->avg('time_taken'),
                2
            ),
            'time_efficiency' => round($timeEfficiencyQuery->avg(DB::raw('time_estimate / time_taken * 100')), 2),
            'completion_rate' => $taskCompletionQuery,
            'average_delay_days' => round(
                (clone $delayedTasksQuery)->where('status_id', $completed)->avg('delay_days'),
                2
            ),
            'filters' => $filter
        ];

        if (empty(array_filter($data, fn($value) => !is_null($value) && $value !== 'filters'))) {
            return apiResponse(null, 'Failed to fetch active users report', false, 404);
        }

        return apiResponse($data, "Active users report fetched successfully");
    }

    // Task status - Pie donut chart
    public function tasksByStatus($id = null, $variant = "", $filter)
    {
        // Fetch statuses from DB (only id & name)
        $statuses = $this->task_status->select('id', 'name')->where('organization_id', $this->organization_id)->get();

        $chart_data = [];
        foreach ($statuses as $index => $status) {
            $chart_data[$index]['status_id'] = $status->id;
            $chart_data[$index]['status'] = $status->name;

            $query = $this->task
                ->where('organization_id', $this->organization_id)
                ->where('status_id', $status->id)
                ->where(function ($query) {
                    $query->whereNotNull('parent_id')->orWhere(function ($subQuery) {
                        $subQuery->whereNull('parent_id')->whereDoesntHave('children');
                    });
                });
            // Only apply filters for dashboard variant (to match previous logic)
            $query = $this->applyFilters($query, ($variant !== 'dashboard' ? $id : null), ($variant === 'dashboard' ? $filter : null));
            $chart_data[$index]['tasks'] = $query->count();
            $chart_data[$index]['fill'] = 'var(--color-' . str($status->name)->slug('_') . ')';
            // turns "In Progress" → "in_progress"
        }

        $data = [
            'chart_data' => $chart_data,
            'filters' => $filter
        ];

        if (empty($data['chart_data'])) {
            return apiResponse(null, 'Failed to fetch task by status report', false, 404);
        }

        return apiResponse($data, "Task by status report fetched successfully");
    }

    // Performance Trend - Line chart label
    public function performanceRatingTrend($id = null, $variant = "", $filter)
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
                ->where('organization_id', $this->organization_id)
                ->where(function ($query) {
                    $query->whereNotNull('parent_id')->orWhere(function ($subQuery) {
                        $subQuery->whereNull('parent_id')->whereDoesntHave('children');
                    });
                });
            $query = $this->applyFilters($query, ($variant !== 'dashboard' ? $id : null), ($variant === 'dashboard' ? $filter : null));
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
            'filters' => $filter
        ];

        if (empty($data['chart_data'])) {
            return apiResponse(null, 'Failed to fetch task activity timeline report', false, 404);
        }

        return apiResponse($data, "Performance rating trend report fetched successfully");
    }

    // Underrun vs Overruns based on date. Bar chart multiple
    public function estimateVsActualDate($id = null, $filter)
    {
        // Get all users, even without tasks, via task_assignees table relation, and get all their assigned tasks
        $query = $this->user
            ->leftJoin('task_assignees', function ($join) {
                $join->on('users.id', '=', 'task_assignees.assignee_id');
            })
            ->leftJoin('tasks', function ($join) {
                $join->on('tasks.id', '=', 'task_assignees.task_id')
                    ->where('tasks.organization_id', $this->organization_id);
            })
            ->where('users.organization_id', $this->organization_id)
            ->where(function ($query) {
                $query->whereNotNull('tasks.parent_id') // include only subtasks
                    ->orWhere(function ($subQuery) {
                        $subQuery->whereNull('tasks.parent_id')
                            ->whereRaw('NOT EXISTS (SELECT 1 FROM tasks t WHERE t.parent_id = tasks.id)');
                    });
            })
            ->select(
                'users.name as assignee',
                DB::raw('ROUND(SUM(days_taken - days_estimate),2) as net_difference'),
                DB::raw('ROUND(SUM(CASE WHEN days_taken > days_estimate THEN days_taken - days_estimate ELSE 0 END),2) as overrun'),
                DB::raw('ROUND(SUM(CASE WHEN days_taken < days_estimate THEN days_estimate - days_taken ELSE 0 END),2) as underrun')
            );

        // if ($id && $variant !== 'dashboard') {
        //     $query->whereHas('assignees', function ($q) use ($id) {
        //         $q->where('users.id', $id);
        //     });
        // }
        if ($filter && $filter['from'] && $filter['to']) {
            $query->whereBetween('start_date', [$filter['from'], $filter['to']]);
        }
        if ($filter && isset($filter['projects'])) {
            $projectIds = explode(',', $filter['projects']); // turns "10,9" into [10, 9]
            $query->whereIn('project_id', $projectIds);
        }
        if ($filter && isset($filter['users'])) {
            $userIds = explode(',', $filter['users']); // turns "10,9" into [10, 9]
            $query->whereIn('users.id', $userIds);
        }
        $chart_data = $query->groupBy('users.name')
            ->get();

        $runs = [
            'over' => round($chart_data->sum('overrun'), 2),
            'under' => round($chart_data->sum('underrun'), 2),
            'net' => round($chart_data->sum('percentage_difference'), 2),
        ];

        $userCount = count($chart_data);

        $data = [
            'chart_data' => $chart_data,
            'runs' => $runs,
            'data_count' => $userCount, //data_count is used by the chart
            'filters' => $filter
        ];

        if (empty($data)) {
            return apiResponse(null, 'Failed to fetch estimate vs actual report', false, 404);
        }

        return apiResponse($data, "Estimate vs actual report fetched successfully");
    }

    public function delaysPerUser($id = null, $filter)
    {
        // Get all users, even without tasks, via task_assignees table relation, and get all their assigned tasks
        $query = $this->user
            ->leftJoin('task_assignees', function ($join) {
                $join->on('users.id', '=', 'task_assignees.assignee_id');
            })
            ->leftJoin('tasks', function ($join) {
                $join->on('tasks.id', '=', 'task_assignees.task_id')
                    ->where('tasks.organization_id', $this->organization_id);
            })
            ->where('users.organization_id', $this->organization_id)
            ->where(function ($query) {
                $query->whereNotNull('tasks.parent_id') // include only subtasks
                    ->orWhere(function ($subQuery) {
                        $subQuery->whereNull('tasks.parent_id')
                            ->whereRaw('NOT EXISTS (SELECT 1 FROM tasks t WHERE t.parent_id = tasks.id)');
                    });
            })
            ->select(
                'users.name as assignee',
                DB::raw('SUM(CASE WHEN delay_days > 0 THEN delay_days ELSE 0 END) as delay'),
            );

        // if ($id && $variant !== 'dashboard') {
        //     $query->whereHas('assignees', function ($q) use ($id) {
        //         $q->where('users.id', $id);
        //     });
        // }
        if ($filter && $filter['from'] && $filter['to']) {
            $query->whereBetween('start_date', [$filter['from'], $filter['to']]);
        }
        if ($filter && isset($filter['projects'])) {
            $projectIds = explode(',', $filter['projects']); // turns "10,9" into [10, 9]
            $query->whereIn('project_id', $projectIds);
        }
        if ($filter && isset($filter['users'])) {
            $userIds = explode(',', $filter['users']); // turns "10,9" into [10, 9]
            $query->whereIn('users.id', $userIds);
        }
        $chart_data = $query->groupBy('users.name')
            ->get();

        $runs = [
            'delay' => $chart_data->sum('delay'),
        ];

        $userCount = count($chart_data);

        $data = [
            'chart_data' => $chart_data,
            // get row with highest and lowest delay including user name
            'highest_delay' => $chart_data->sortByDesc('delay')->first(),
            'lowest_delay' => $chart_data->sortBy('delay')->first(),
            'data_count' => $userCount, //data_count is used by the chart
            'filters' => $filter
        ];

        if (empty($data)) {
            return apiResponse(null, 'Failed to fetch delay per user report', false, 404);
        }

        return apiResponse($data, "Delay per user report fetched successfully");
    }

    /* ------------------------------ USER REPORTS ------------------------------ */
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
                ->whereHas('assignees', function ($query) use ($id) {
                    $query->where('users.id', $id);
                })
                ->where('organization_id', $this->organization_id)
                ->whereYear('start_date', $m['year'])
                ->whereMonth('start_date', $m['month_num'])
                ->where(function ($query) {
                    $query->whereNotNull('parent_id')->orWhere(function ($subQuery) { // dont include parent tasks in metrics
                        $subQuery->whereNull('parent_id')->whereDoesntHave('children');
                    });
                });

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
            'filters' => $filter
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
                $join->on('tasks.category_id', '=', 'categories.id');

                // Filter by assignee
                if ($id) {
                    $join->leftJoin('task_assignees', 'tasks.id', '=', 'task_assignees.task_id')
                        ->where('task_assignees.assignee_id', $id);
                }
                if ($filter && $filter['from'] && $filter['to']) {
                    $join->whereBetween('tasks.start_date', [$filter['from'], $filter['to']]);
                }
                if ($filter && isset($filter['projects'])) {
                    $projectIds = explode(',', $filter['projects']); // turns "10,9" into [10, 9]
                    $join->whereIn('project_id', $projectIds);
                }
            })
            ->where('categories.organization_id', $this->organization_id)
            ->where(function ($query) {
                $query->whereNotNull('tasks.parent_id') // include only subtasks
                    ->orWhere(function ($subQuery) {
                        $subQuery->whereNull('tasks.parent_id')
                            ->whereRaw('NOT EXISTS (SELECT 1 FROM tasks t WHERE t.parent_id = tasks.id)');
                    });
            });

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

    // 10 recent tasks estimate vs actual. Bar chart multiple
    public function userEstimateVsActual($id, $filter)
    {
        // Fetch the 10 most recent tasks for the user
        $query = $this->task
            ->where('organization_id', $this->organization_id)
            ->where(function ($query) {
                $query->whereNotNull('parent_id')->orWhere(function ($subQuery) {
                    $subQuery->whereNull('parent_id')->whereDoesntHave('children');
                });
            });
        $query = $this->applyFilters($query, $id, $filter);
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
            'data_count' => $taskCount,
            'filters' => $filter
        ];

        if (empty($data)) {
            return apiResponse(null, 'Failed to fetch estimate vs actual report', false, 404);
        }

        return apiResponse($data, "Estimate vs actual report fetched successfully");
    }

    /* ---------------------------- DASHBOARD REPORTS --------------------------- */
    // Users activity load. Horizontal Bar chart
    public function usersTaskLoad($filter)
    {
        // Get all users, even without tasks, via task_assignees table relation, and get all their assigned tasks
        $query = $this->user
            ->leftJoin('task_assignees', function ($join) {
                $join->on('users.id', '=', 'task_assignees.assignee_id');
            })
            ->leftJoin('tasks', function ($join) {
                $join->on('tasks.id', '=', 'task_assignees.task_id')
                    ->where('tasks.organization_id', $this->organization_id);
            })
            ->where('users.organization_id', $this->organization_id)
            ->where(function ($query) {
                $query->whereNotNull('tasks.parent_id') // include only subtasks
                    ->orWhere(function ($subQuery) {
                        $subQuery->whereNull('tasks.parent_id')
                            ->whereRaw('NOT EXISTS (SELECT 1 FROM tasks t WHERE t.parent_id = tasks.id)');
                    });
            });

        if ($filter && isset($filter['users'])) {
            $userIds = explode(',', $filter['users']); // turns "10,9" into [10, 9]
            $query->whereIn('users.id', $userIds);
        }
        if ($filter && $filter['from'] && $filter['to']) {
            $query->whereBetween('start_date', [$filter['from'], $filter['to']]);
        }
        if ($filter && isset($filter['projects'])) {
            $projectIds = explode(',', $filter['projects']); // turns "10,9" into [10, 9]
            $query->whereIn('project_id', $projectIds);
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
            'filters' => $filter
        ];

        if (empty($data)) {
            return apiResponse(null, 'Failed to fetch task activity timeline report', false, 404);
        }

        return apiResponse($data, "Users task load report fetched successfully");
    }

    // Leaderboards. Datatable
    public function performanceLeaderboard($filter)
    {
        // Get all users, even without tasks, via task_assignees table relation, and get all their assigned tasks
        $query = $this->user
            ->leftJoin('task_assignees', function ($join) {
                $join->on('users.id', '=', 'task_assignees.assignee_id');
            })
            ->leftJoin('tasks', function ($join) {
                $join->on('tasks.id', '=', 'task_assignees.task_id')
                    ->where('tasks.organization_id', $this->organization_id);
            })
            ->where('users.organization_id', $this->organization_id)
            ->where(function ($query) {
                $query->whereNotNull('tasks.parent_id') // include only subtasks
                    ->orWhere(function ($subQuery) {
                        $subQuery->whereNull('tasks.parent_id')
                            ->whereRaw('NOT EXISTS (SELECT 1 FROM tasks t WHERE t.parent_id = tasks.id)');
                    });
            });

        if ($filter && isset($filter['users'])) {
            $userIds = explode(',', $filter['users']); // turns "10,9" into [10, 9]
            $query->whereIn('users.id', $userIds);
        }
        if ($filter && $filter['from'] && $filter['to']) {
            $query->whereBetween('start_date', [$filter['from'], $filter['to']]);
        }
        if ($filter && isset($filter['projects'])) {
            $projectIds = explode(',', $filter['projects']); // turns "10,9" into [10, 9]
            $query->whereIn('project_id', $projectIds);
        }
        $chart_data = $query->select(
            'users.id',
            'name',
            'users.position',
            DB::raw('ROUND(AVG(tasks.performance_rating),2) as avg_performance_rating')
        )
            ->groupBy('users.id', 'name', 'users.position')
            ->orderByDesc('avg_performance_rating')
            ->limit(10)
            ->get();

        $data = [
            'chart_data' => $chart_data,
            'filters' => $filter
        ];

        if (empty($data)) {
            return apiResponse(null, 'Failed to fetch performance leaderboard report', false, 404);
        }

        return apiResponse($data, "Performance leaderbord fetched successfully");
    }

    // Underrun vs Overruns based on time. Bar chart multiple
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
            ->where('tasks.organization_id', $this->organization_id)
            ->where('categories.organization_id', $this->organization_id)
            ->where(function ($query) {
                $query->whereNotNull('tasks.parent_id') // include only subtasks
                    ->orWhere(function ($subQuery) {
                        $subQuery->whereNull('tasks.parent_id')
                            ->whereRaw('NOT EXISTS (SELECT 1 FROM tasks t WHERE t.parent_id = tasks.id)');
                    });
            });
        if ($filter && $filter['from'] && $filter['to']) {
            $query->whereBetween('start_date', [$filter['from'], $filter['to']]);
        }
        if ($filter && isset($filter['projects'])) {
            $projectIds = explode(',', $filter['projects']); // turns "10,9" into [10, 9]
            $query->whereIn('project_id', $projectIds);
        }
        if ($filter && isset($filter['users'])) {
            $userIds = explode(',', $filter['users']); // turns "10,9" into [10, 9]
            $query->whereHas('assignees', function ($query) use ($userIds) {
                $query->whereIn('users.id', $userIds);
            });
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
            'data_count' => $categoryCount,
            'filters' => $filter
        ];

        if (empty($data)) {
            return apiResponse(null, 'Failed to fetch estimate vs actual report', false, 404);
        }

        return apiResponse($data, "Estimate vs actual report fetched successfully");
    }
}
