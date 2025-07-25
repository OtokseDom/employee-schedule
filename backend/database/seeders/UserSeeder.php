<?php

namespace Database\Seeders;

use Carbon\Carbon;
use Illuminate\Support\Str;
use Illuminate\Database\Seeder;

class UserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        \App\Models\User::factory(10)->create();

        \App\Models\User::factory()->create([
            'organization_id' => 1,
            'name' => "Admin User",
            'dob' => Carbon::parse('2000-11-08'),
            'position' => "Software Engineer",
            'role' => "Superadmin",
            'email' => "admin@demo.com", //dom@gmail.com
            'email_verified_at' => now(),
            'password' => 'admin123', // 1
            'status' => 'active', // active, inactive, pending, banned
            'remember_token' => Str::random(10),
        ]);
    }
}
