<?php

namespace Database\Seeders;

use App\Models\Project;
use Illuminate\Database\Seeder;
use Carbon\Carbon;

class ProjectSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $projects =
            [
                [
                    'organization_id' => 1,
                    'status_id' => 1,
                    'title' => 'Project Alpha',
                    'description' => 'Pioneer Project',
                    'target_date' => Carbon::parse('2025-08-12'),
                    'estimated_date' => Carbon::parse('2025-07-12'),
                    'priority' => 'Critical',
                    'remarks' => 'breaking changes'
                ],
                [
                    'organization_id' => 1,
                    'status_id' => 2,
                    'title' => 'Project Beta',
                    'description' => 'Pioneer Project',
                    'target_date' => Carbon::parse('2025-08-12'),
                    'estimated_date' => Carbon::parse('2025-07-12'),
                    'priority' => 'Medium',
                    'remarks' => 'Module adjustments'
                ]
            ];

        foreach ($projects as $project) {
            Project::create($project);
        }
    }
}