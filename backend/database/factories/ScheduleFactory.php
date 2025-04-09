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
            'event_id' => Event::inRandomOrder()->value('id'), // Get a random existing Event ID
            'user_id' => User::inRandomOrder()->value('id'), // Get a random existing User ID
            'shift_start' => fake()->dateTimeBetween('06:00:00', '09:00:00'), // Random time between 6 AM and 9 AM
            'shift_end' => fake()->dateTimeBetween('16:00:00', '18:00:00'), // Random time between 4 PM and 6 PM
            'date' => fake()->dateTimeBetween(
                now()->startOfMonth()->subMonth()->startOfDay(),
                now()->addMonth()->endOfMonth()->endOfDay()
            ),
            'status' => fake()->randomElement(["Pending", "Completed", "In Progress", "Cancelled"])
        ];
    }
}