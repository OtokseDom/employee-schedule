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

        Project::create([
            'organization_id' => 1,
            'title' => 'Porject Alpha',
            'description' => 'Pioneer Project',
            'target_date' => Carbon::parse('2025-08-12'),
            'estimated_date' => Carbon::parse('2025-07-12'),
            'priority' => 'Critical',
            'status' => 'In Progress',
            'remarks' => 'breaking changes'

        ]);
    }
}
