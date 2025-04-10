<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class UserReportController extends Controller
{
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
        return response($data);
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
            'value' => $month1 > 0
                ? round(abs((($month1 - $month2) / $month2) * 100), 2)
                : ($month2 > 0 ? 100 : 0),
            'event' => $month1 > $month2 ? 'Increased' : ($month1 < $month2 ? 'Decreased' : 'Same'),
        ];

        return response()->json([
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
        ]);
    }

    /**
     * Display report for tasks by nearest end date. Radar chart
     */
    public function overdueTasks()
    {
        //
    }
}