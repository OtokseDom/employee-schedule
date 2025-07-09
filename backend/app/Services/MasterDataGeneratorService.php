<?php

namespace App\Services;

use App\Models\Category;
use Carbon\Carbon;

class MasterDataGeneratorService
{
    public static function generate($organizationId)
    {
        $now = Carbon::now();
        $categories = [
            [
                'organization_id' => $organizationId,
                'name' => 'Bug Fix',
                'description' => 'Fix found bugs in the application',
                'created_at' => $now,
                'updated_at' => $now,
            ],
            [
                'organization_id' => $organizationId,
                'name' => 'Feature',
                'description' => 'Develop or enhance application features',
                'created_at' => $now,
                'updated_at' => $now,
            ],
            [
                'organization_id' => $organizationId,
                'name' => 'Documentation',
                'description' => 'Write or update technical/user documentation',
                'created_at' => $now,
                'updated_at' => $now,
            ],
            [
                'organization_id' => $organizationId,
                'name' => 'Maintenance',
                'description' => 'Refactor, update libraries, or general upkeep',
                'created_at' => $now,
                'updated_at' => $now,
            ],
            [
                'organization_id' => $organizationId,
                'name' => 'Testing & QA',
                'description' => 'Manual or automated testing and quality checks',
                'created_at' => $now,
                'updated_at' => $now,
            ],
            [
                'organization_id' => $organizationId,
                'name' => 'Other',
                'description' => 'Miscellaneous or uncategorized tasks',
                'created_at' => $now,
                'updated_at' => $now,
            ],
        ];

        Category::insert($categories);
    }
}
