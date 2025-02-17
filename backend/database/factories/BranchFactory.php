<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\User>
 */
class BranchFactory extends Factory
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
            'name' => fake()->city(),
            'code' => fake()->citySuffix(),
            'description' => fake()->sentence(),
            'country' => fake()->country(),
            'city' => fake()->city(),
            'region' =>  fake()->city(),
            'address_line' => fake()->address(),
            'phone' => fake()->phoneNumber(),
            'email' => fake()->email(),
        ];
    }
}
