<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\User>
 */
class CustomerFactory extends Factory
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
            'type' => fake()->numberBetween(1, 2),
            'category' => fake()->numberBetween(1, 2),
            'first_name' => fake()->firstName(),
            'middle_name' => fake()->lastName(),
            'last_name' => fake()->lastName(),
            'address' => fake()->address(),
            'phone' => fake()->phoneNumber(),
            'email' => fake()->email(),
            'image' =>  "/customers/images/customer_img.jpg"
        ];
    }
}
