<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\User>
 */
class StorageFactory extends Factory
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
            'warehouse_id' => fake()->numberBetween(1, 10),
            'name' => fake()->name(),
            'code' => fake()->word(),
            'type' => fake()->numberBetween(1, 5),
            'description' => fake()->sentence(),
            'capacity' => fake()->word(),
            'dimension' => fake()->sentence(3),
            'weight_capacity' => fake()->word(),
            'status' => fake()->numberBetween(1, 4),
        ];
    }
}
