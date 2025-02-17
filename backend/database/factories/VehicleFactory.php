<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\User>
 */
class VehicleFactory extends Factory
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
            'name' => fake()->word(),
            'type' => "Van",
            'make' => fake()->company(),
            'model' => fake()->word(),
            'plate_number' => fake()->swiftBicNumber(),
            'vehicle_id' =>  fake()->swiftBicNumber(),
            'capacity' => fake()->word(),
            'dimension' => fake()->word(),
            'weight_capacity' => fake()->word(),
        ];
    }
}
