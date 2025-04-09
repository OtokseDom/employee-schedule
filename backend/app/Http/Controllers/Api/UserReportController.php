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
    // visitors: {
    // 	label: "Visitors",
    // },
    // chrome: {
    // 	label: "Chrome",
    // 	color: "hsl(var(--chart-1))",
    // },
    // safari: {
    // 	label: "Safari",
    // 	color: "hsl(var(--chart-2))",
    // },
    // firefox: {
    // 	label: "Firefox",
    // 	color: "hsl(var(--chart-3))",
    // },
    // edge: {
    // 	label: "Edge",
    // 	color: "hsl(var(--chart-4))",
    // },
    // other: {
    // 	label: "Other",
    // 	color: "hsl(var(--chart-5))",
    // },
    /**
     * Display report for tasks timeline to see users activity load. Area chart
     */
    public function taskActivityTimeline()
    {
        //
    }

    /**
     * Display report for tasks by nearest end date. Radar chart
     */
    public function overdueTasks()
    {
        //
    }
}