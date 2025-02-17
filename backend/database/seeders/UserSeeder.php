<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
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
            'name' => "Dominic Escoto",
            'email' => "imjohndominic08@gmail.com",
            'email_verified_at' => now(),
            'password' => 'admin123', // password
            'remember_token' => Str::random(10),
        ]);
    }
}
