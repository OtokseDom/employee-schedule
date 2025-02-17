<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\User>
 */
class ContactFactory extends Factory
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
        return [
            'name' => fake()->name(),
            'country' => fake()->country(),
            'region' => fake()->city(),
            'city' => fake()->city(),
            'address_line' => fake()->address(),
            'phone' => fake()->phoneNumber(),
            'email' => fake()->email(),
            'description' => fake()->sentence(),
        ];
    }
}
