<?php

namespace Database\Seeders;

// use Illuminate\Database\Console\Seeds\WithoutModelEvents;

use App\Models\TaskStatus;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        $this->call([
            OrganizationSeeder::class,
            UserSeeder::class,
            TaskStatus::class,
            ProjectSeeder::class,
            CategorySeeder::class,
            TaskSeeder::class,
            TaskHistorySeeder::class,
        ]);
    }
}
