<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;
use App\Models\User;
use App\Models\PerformanceReport;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\PerformanceReport>
 */
class PerformanceReportFactory extends Factory
{
    protected $model = PerformanceReport::class;

    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition()
    {

        return [
            'user_id' => User::inRandomOrder()->value('id'),
            'average_rating' => $this->faker->randomFloat(2, 0, 5),
            'total_tasks' => $this->faker->numberBetween(0, 100),
            'tasks_on_time' => $this->faker->numberBetween(0, 100),
            'tasks_delayed' => $this->faker->numberBetween(0, 100),
            'tasks_pending' => $this->faker->numberBetween(0, 100),
            'tasks_completed' => $this->faker->numberBetween(0, 100),
            'tasks_in_progress' => $this->faker->numberBetween(0, 100),
            'tasks_cancelled' => $this->faker->numberBetween(0, 100),
            'tasks_on_hold' => $this->faker->numberBetween(0, 100),
            'assessment_date' => $this->faker->date,
        ];
    }
}