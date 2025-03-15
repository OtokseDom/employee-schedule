<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;
use App\Models\User;
use App\Models\Task;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Task>
 */
class TaskFactory extends Factory
{
    protected $model = Task::class;

    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition()
    {
        return [
            'category' => $this->faker->word,
            'title' => $this->faker->sentence,
            'description' => $this->faker->paragraph,
            'expected_output' => $this->faker->sentence,
            'assignee_id' => User::factory(),
            'status' => $this->faker->randomElement(['Pending', 'In Progress', 'Completed', 'Delayed', 'Cancelled', 'On Hold']),
            'start_date' => $this->faker->date,
            'end_date' => $this->faker->date,
            'time_estimate' => $this->faker->randomFloat(2, 1, 100),
            'time_taken' => $this->faker->randomFloat(2, 1, 100),
            'delay' => $this->faker->randomFloat(2, 0, 10),
            'delay_reason' => $this->faker->sentence,
            'performance_rating' => $this->faker->numberBetween(0, 100),
            'remarks' => $this->faker->paragraph,
        ];
    }
}
