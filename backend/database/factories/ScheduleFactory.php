<?php

namespace Database\Factories;

use App\Models\Event;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\User>
 */
class ScheduleFactory extends Factory
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
            'title' => fake()->sentence(3),
            'category' => fake()->randomElement(['Meeting', 'Work', 'Event', 'Task', 'Training', 'Other']),
            'start_date' => fake()->dateTimeBetween('now', '+1 month'),
            'end_date' => fake()->dateTimeBetween('+1 month', '+2 months'),
            'start_time' => fake()->time('H:i:s', '09:00:00'),
            'end_time' => fake()->time('H:i:s', '19:00:00'),
            'description' => fake()->optional()->sentence(8),
            'assignee' => \App\Models\User::inRandomOrder()->value('id'),
            'status' => fake()->randomElement(['Pending', 'In Progress', 'Completed', 'Delayed', 'Cancelled', 'On Hold'])
        ];
    }
}