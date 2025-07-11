<?php

namespace App\Services;

use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
// TODO: Move all reports here
class ReportService
{
    public static function performanceRatingTrend($id, $variant = "")
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
}
