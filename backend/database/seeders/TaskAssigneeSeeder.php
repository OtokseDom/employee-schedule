<?php

namespace Database\Seeders;


use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class TaskAssigneeSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Get all user IDs (assuming 4 default users)
        $userIds = \App\Models\User::pluck('id')->toArray();
        $taskIds = \App\Models\Task::pluck('id')->toArray();

        $assignments = [];
        $userCount = count($userIds);
        foreach ($taskIds as $i => $taskId) {
            $assigneeId = $userIds[$i % $userCount];
            $assignments[] = [
                'task_id' => $taskId,
                'assignee_id' => $assigneeId,
                'created_at' => now(),
                'updated_at' => now(),
            ];
        }

        DB::table('task_assignees')->truncate();
        DB::table('task_assignees')->insert($assignments);
    }
}
