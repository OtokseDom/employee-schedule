<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\PerformanceReport;

class PerformanceReportSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        PerformanceReport::factory()->count(30)->create();
    }
}