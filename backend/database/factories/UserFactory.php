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
            'organization_id' => 1,
            'name' => fake()->name(),
            'dob' => fake()->date(),
            'position' => fake()->jobTitle(),
            'role' => fake()->randomElement($roles),
            'email' => fake()->unique()->safeEmail(),
            'email_verified_at' => now(),
            'password' => '$2y$12$tXliF33idwwMmvk1tiF.ZOotEsqQnuWinaX90NLaw.rEchjbEAXCW', // password: admin123
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
