<?php

namespace Database\Seeders;

use App\Models\Project;
use Illuminate\Database\Seeder;
use App\Models\Task;
use App\Models\TaskStatus;
use Illuminate\Support\Facades\DB;

class KanbanColumnSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */

    public function run()
    {
        $projects = Project::all();
        $statuses = TaskStatus::orderBy('id')->get(); // initial order

        foreach ($projects as $project) {
            foreach ($statuses as $index => $status) {
                DB::table('kanban_columns')->insert([
                    'project_id' => $project->id,
                    'task_status_id' => $status->id,
                    'position' => $index + 1, // start positions at 1
                    'created_at' => now(),
                    'updated_at' => now(),
                ]);
            }
        }

        $this->command->info('Kanban columns seeded for all projects.');
    }
}
