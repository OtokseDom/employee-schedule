<?php

namespace Database\Factories;

use App\Models\Category;
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
            'category_id' => Category::inRandomOrder()->value('id'),
            'title' => $this->faker->sentence,
            'description' => $this->faker->paragraph,
            'expected_output' => $this->faker->sentence,
            'assignee_id' => User::inRandomOrder()->value('id'),
            'status' => $this->faker->randomElement(['Pending', 'In Progress', 'Completed', 'Delayed', 'Cancelled', 'On Hold']),
            'start_date' => $startDate = fake()->dateTimeBetween('now', '+1 month'),
            'end_date' => $startDate,
            'start_time' => '07:00:00',
            'end_time' => '16:00:00',
            'time_estimate' => $this->faker->randomFloat(2, 1, 100),
            'time_taken' => $this->faker->randomFloat(2, 1, 100),
            'delay' => $this->faker->randomFloat(2, 0, 10),
            'delay_reason' => $this->faker->sentence,
            'performance_rating' => $this->faker->numberBetween(0, 10),
            'remarks' => $this->faker->paragraph,
        ];
    }
}