<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\TaskHistory;

class TaskHistorySeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        TaskHistory::factory()->count(50)->create();
    }
}
