<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\User>
 */
class SupplierFactory extends Factory
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
            'name' => fake()->company(),
            'type' => fake()->numberBetween(1, 2),
            'category' => fake()->numberBetween(1, 2),
            'phone' => fake()->phoneNumber(),
            'email' => fake()->email(),
            'image' =>  "/suppliers/images/customer_img.jpg",
            'address' => fake()->address(),
        ];
    }
}
