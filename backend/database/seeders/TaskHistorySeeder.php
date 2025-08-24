<?php

namespace Database\Seeders;

use App\Models\Task;
use Illuminate\Database\Seeder;
use App\Models\TaskHistory;
use App\Models\User;

class TaskHistorySeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // TaskHistory::factory()->count(10)->create();

        $userId = User::inRandomOrder()->value('id');

        Task::all()->each(function ($task) use ($userId) {
            TaskHistory::create([
                'organization_id' => $task->organization_id,
                'task_id' => $task->id,
                'status_id' => 1,
                'changed_by' => $userId,
                'changed_at' => now(),
                'remarks' => 'Task Added',
            ]);
        });
    }
}
