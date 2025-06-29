<?php

namespace Database\Seeders;

use App\Models\Category;
use Illuminate\Database\Seeder;

class CategorySeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $categories = [
            [
                'name' => 'Bug Fix',
                'description' => 'Fix found bugs in the application',
            ],
            [
                'name' => 'Feature',
                'description' => 'Develop or enhance application features',
            ],
            [
                'name' => 'Documentation',
                'description' => 'Write or update technical/user documentation',
            ],
            [
                'name' => 'Maintenance',
                'description' => 'Refactor, update libraries, or general upkeep',
            ],
            [
                'name' => 'Testing & QA',
                'description' => 'Manual or automated testing and quality checks',
            ],
            [
                'name' => 'Other',
                'description' => 'Miscellaneous or uncategorized tasks',
            ],
        ];

        foreach ($categories as $category) {
            Category::create($category);
        }
    }
}