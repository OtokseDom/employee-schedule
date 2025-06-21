<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;
use App\Models\User;
use App\Models\Task;
use App\Models\TaskHistory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\TaskHistory>
 */
class TaskHistoryFactory extends Factory
{
    protected $model = TaskHistory::class;

    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition()
    {
        return [
            'task_id' => Task::inRandomOrder()->value('id'),
            'status' => $this->faker->randomElement(['Pending', 'In Progress', 'Completed', 'Delayed', 'Cancelled', 'On Hold']),
            'changed_by' => User::inRandomOrder()->value('id'),
            'changed_at' => $this->faker->dateTime,
            'remarks' => $this->faker->paragraph,
        ];
    }
}
