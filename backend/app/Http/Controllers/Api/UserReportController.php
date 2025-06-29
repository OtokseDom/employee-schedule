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
        $data = [
            'tasks_by_status' => $tasksByStatus->getData(),
            'task_activity_timeline' => $taskActivityTimeline->getData(),
            'rating_per_category' => $ratingPerCategory->getData(),
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
        $month1 = DB::table('tasks')
            ->where('assignee_id', $id)
            ->whereMonth('start_date', now()->month)
            ->count();
        $month2 = DB::table('tasks')
            ->where('assignee_id', $id)
            ->whereMonth('start_date', now()->subMonth(1)->month)
            ->count();
        $month3 = DB::table('tasks')
            ->where('assignee_id', $id)
            ->whereMonth('start_date', now()->subMonth(2)->month)
            ->count();
        $month4 = DB::table('tasks')
            ->where('assignee_id', $id)
            ->whereMonth('start_date', now()->subMonth(3)->month)
            ->count();
        $month5 = DB::table('tasks')
            ->where('assignee_id', $id)
            ->whereMonth('start_date', now()->subMonth(4)->month)
            ->count();
        $month6 = DB::table('tasks')
            ->where('assignee_id', $id)
            ->whereMonth('start_date', now()->subMonth(5)->month)
            ->count();

        $percentageDifference = [
            'value' => ($month2 != 0)
                ? round(abs((($month1 - $month2) / $month2) * 100), 2)
                : ($month1 > 0 ? 100 : 0),
            'event' => $month1 > $month2 ? 'Increased' : ($month1 < $month2 ? 'Decreased' : 'Same'),
        ];

        $data = [
            'percentage_difference' => $percentageDifference,
            'chart_data' => [
                [
                    'year' =>  now()->subMonth(5)->format('Y'),
                    'month' =>  now()->subMonth(5)->format('F'),
                    'tasks' => $month6,
                ],
                [
                    'year' =>  now()->subMonth(4)->format('Y'),
                    'month' =>  now()->subMonth(4)->format('F'),
                    'tasks' => $month5,
                ],
                [
                    'year' =>  now()->subMonth(3)->format('Y'),
                    'month' =>  now()->subMonth(3)->format('F'),
                    'tasks' => $month4,
                ],
                [
                    'year' =>  now()->subMonth(2)->format('Y'),
                    'month' =>  now()->subMonth(2)->format('F'),
                    'tasks' => $month3,
                ],
                [
                    'year' =>  now()->subMonth(1)->format('Y'),
                    'month' =>  now()->subMonth(1)->format('F'),
                    'tasks' => $month2,
                ],
                [
                    'year' =>  now()->format('Y'),
                    'month' =>  now()->format('F'),
                    'tasks' => $month1,
                ],
            ]
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
                    'value' => is_null($item->average_rating) ? 0 : round($item->average_rating, 2),
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
}
