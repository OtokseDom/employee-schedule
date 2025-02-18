<?php

namespace Database\Factories;

use App\Models\Employee;
use App\Models\Event;
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
            'employee_id' => Employee::inRandomOrder()->value('id'), // Get a random existing Employee ID
            'shift_start' => fake()->dateTime(),
            'shift_end' => fake()->dateTime(),
            'status' => fake()->randomElement(["Pending", "Completed", "In Progress", "Cancelled"])
        ];
    }
}