<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;

class StorageSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        \App\Models\Storage::factory(10)->create();
    }
}
