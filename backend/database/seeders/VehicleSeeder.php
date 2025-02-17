<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;

class VehicleSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        \App\Models\Vehicle::factory(10)->create();
    }
}
