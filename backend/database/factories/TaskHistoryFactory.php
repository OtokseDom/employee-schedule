<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;
use App\Models\User;
use App\Models\Task;
use App\Models\TaskHistory;
use App\Models\TaskStatus;

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
            'organization_id' => 1,
            'task_id' => Task::inRandomOrder()->value('id'),
            'status_id' => TaskStatus::inRandomOrder()->value('id'),
            'changed_by' => User::inRandomOrder()->value('id'),
            'changed_at' => $this->faker->dateTime,
            'remarks' => "Task Added",
        ];
    }
}
