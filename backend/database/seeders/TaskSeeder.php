<?php

namespace Database\Seeders;

use App\Models\Project;
use Illuminate\Database\Seeder;
use App\Models\Task;
use App\Models\TaskStatus;
use Illuminate\Support\Facades\DB;

class TaskSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        DB::statement('SET FOREIGN_KEY_CHECKS=0;');
        DB::table('tasks')->truncate();
        DB::statement('SET FOREIGN_KEY_CHECKS=1;');

        // Step 1: Seed tasks
        Task::factory()->count(50)->create(); // or more tasks

        // Step 2: Update positions per project and status
        $projects = Project::all();
        $statuses = TaskStatus::all();

        foreach ($projects as $project) {
            foreach ($statuses as $status) {
                $tasks = Task::where('project_id', $project->id)
                    ->where('status_id', $status->id)
                    ->orderBy('created_at')
                    ->get();

                $position = 1;
                foreach ($tasks as $task) {
                    $task->update(['position' => $position++]);
                }
            }
        }
    }
}
