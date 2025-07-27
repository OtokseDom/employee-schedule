<?php

namespace Database\Seeders;

use App\Models\User;
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


        $users = [
            [
                'organization_id' => 1,
                'name' => "Superadmin User",
                'dob' => Carbon::parse('2000-11-08'),
                'position' => "Software Engineer",
                'role' => "Superadmin",
                'email' => "superadmin@demo.com", //dom@gmail.com
                'email_verified_at' => now(),
                'password' => 'admin123', // 1
                'status' => 'active', // active, inactive, pending, banned
                'remember_token' => Str::random(10),
            ],
            [
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
            ],
            [
                'organization_id' => 1,
                'name' => "Manager User",
                'dob' => Carbon::parse('2000-11-08'),
                'position' => "Software Engineer",
                'role' => "Manager",
                'email' => "manager@demo.com", //dom@gmail.com
                'email_verified_at' => now(),
                'password' => 'admin123', // 1
                'status' => 'active', // active, inactive, pending, banned
                'remember_token' => Str::random(10),
            ],
            [
                'organization_id' => 1,
                'name' => "Employee User",
                'dob' => Carbon::parse('2000-11-08'),
                'position' => "Software Engineer",
                'role' => "Employee",
                'email' => "employee@demo.com", //dom@gmail.com
                'email_verified_at' => now(),
                'password' => 'admin123', // 1
                'status' => 'active', // active, inactive, pending, banned
                'remember_token' => Str::random(10),
            ]
        ];

        foreach ($users as $user) {
            User::create($user);
        }
        // \App\Models\User::factory()->create([
        //     'organization_id' => 1,
        //     'name' => "Admin User",
        //     'dob' => Carbon::parse('2000-11-08'),
        //     'position' => "Software Engineer",
        //     'role' => "Superadmin",
        //     'email' => "admin@demo.com", //dom@gmail.com
        //     'email_verified_at' => now(),
        //     'password' => 'admin123', // 1
        //     'status' => 'active', // active, inactive, pending, banned
        //     'remember_token' => Str::random(10),
        // ]);
    }
}
