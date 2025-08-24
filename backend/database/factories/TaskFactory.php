<?php

namespace Database\Factories;

use App\Models\Category;
use App\Models\Organization;
use Illuminate\Database\Eloquent\Factories\Factory;
use App\Models\User;
use App\Models\Task;
use App\Models\TaskStatus;

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
            'organization_id' => 1,
            'status_id' => TaskStatus::inRandomOrder()->value('id'),
            'project_id' => 1,
            'category_id' => Category::inRandomOrder()->value('id'),
            'title' => $this->faker->sentence,
            'description' => $this->faker->paragraph,
            'expected_output' => $this->faker->sentence,
            'start_date' => $startDate = fake()->dateTimeBetween('now', '+1 month'),
            'end_date' => $startDate,
            'start_time' => $this->faker->randomElement(['07:30:00', '08:00:00', '08:20:00', '09:45:00', '10:00:00']),
            'end_time' => $this->faker->randomElement(['13:30:00', '14:00:00', '15:45:00', '15:20:00', '16:00:00']),
            'time_estimate' => $this->faker->randomFloat(1, 1, 24),
            'time_taken' => $this->faker->randomFloat(1, 1, 36),
            'delay' => $this->faker->randomFloat(1, 0, 10),
            'delay_reason' => $this->faker->sentence,
            'performance_rating' => $this->faker->numberBetween(0, 10),
            'remarks' => $this->faker->paragraph,
        ];
    }
}
