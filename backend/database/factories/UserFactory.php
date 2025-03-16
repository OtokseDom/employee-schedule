<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\User>
 */
class UserFactory extends Factory
{
    /**
     * The current password being used by the factory.
     */
    protected static ?string $password;

    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition()
    {

        $roles = [
            'Superadmin',
            'Admin',
            'Manager',
            'Employee',
        ];
        return [
            'name' => fake()->name(),
            'dob' => fake()->date(),
            'position' => fake()->jobTitle(),
            'role' => fake()->randomElement($roles),
            'email' => fake()->unique()->safeEmail(),
            'email_verified_at' => now(),
            'password' => '$2y$10$Q5xkjOGTDwB3YOGprqu2N.FbPA5QgKE.E5pKP4DdCYeFpxSFGzFQm', // password: admin123
            'remember_token' => Str::random(10),
        ];
    }

    /**
     * Indicate that the model's email address should be unverified.
     *
     * @return static
     */
    public function unverified()
    {
        return $this->state(fn(array $attributes) => [
            'email_verified_at' => null,
        ]);
    }
}