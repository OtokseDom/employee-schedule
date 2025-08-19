<?php

namespace Database\Seeders;

use App\Models\TaskStatus;
use Illuminate\Database\Seeder;

class TaskStatusSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $statuses = [
            [
                'organization_id' => 1,
                'name' => 'Pending',
                'description' => 'To do tasks that are yet to be started',
                'color' => 'yellow',
            ],
            [
                'organization_id' => 1,
                'name' => 'In Progress',
                'description' => 'Tasks that are currently being worked on',
                'color' => 'blue',
            ],
            [
                'organization_id' => 1,
                'name' => 'For Review',
                'description' => 'Tasks that are completed and awaiting review',
                'color' => 'orange',
            ],
            [
                'organization_id' => 1,
                'name' => 'Completed',
                'description' => 'Tasks that have been finished',
                'color' => 'green',
            ],
            [
                'organization_id' => 1,
                'name' => 'Delayed',
                'description' => 'Tasks that are behind schedule',
                'color' => 'purple',
            ],
            [
                'organization_id' => 1,
                'name' => 'On Hold',
                'description' => 'Tasks that are temporarily paused',
                'color' => 'gray',
            ],
            [
                'organization_id' => 1,
                'name' => 'Cancelled',
                'description' => 'Tasks that have been cancelled and will not be completed',
                'color' => 'red',
            ],
        ];

        foreach ($statuses as $status) {
            TaskStatus::create($status);
        }
    }
}
