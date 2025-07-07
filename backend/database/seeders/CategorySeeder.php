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
                'organization_id' => 1,
                'name' => 'Bug Fix',
                'description' => 'Fix found bugs in the application',
            ],
            [
                'organization_id' => 1,
                'name' => 'Feature',
                'description' => 'Develop or enhance application features',
            ],
            [
                'organization_id' => 1,
                'name' => 'Documentation',
                'description' => 'Write or update technical/user documentation',
            ],
            [
                'organization_id' => 1,
                'name' => 'Maintenance',
                'description' => 'Refactor, update libraries, or general upkeep',
            ],
            [
                'organization_id' => 1,
                'name' => 'Testing & QA',
                'description' => 'Manual or automated testing and quality checks',
            ],
            [
                'organization_id' => 1,
                'name' => 'Other',
                'description' => 'Miscellaneous or uncategorized tasks',
            ],
        ];

        foreach ($categories as $category) {
            Category::create($category);
        }
    }
}
