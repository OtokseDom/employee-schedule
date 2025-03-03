<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\User>
 */
class EventFactory extends Factory
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
        $tasks = [
            'Team Meeting',
            'Client Call',
            'Project Presentation',
            'Code Review',
            'Server Maintenance',
            'Bug Fixing',
            'Documentation',
            'Design Mockups',
            'Database Optimization',
            'Content Writing',
            'Customer Support',
            'Training Session'
        ];
        return [
            'name' => fake()->randomElement($tasks),
            'description' => fake()->sentence(),
        ];
    }
}