<?php

namespace App\Http\Controllers\Api\v1;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreTaskRequest;
use App\Http\Requests\UpdateTaskRequest;
use App\Models\Task;
use App\Models\TaskHistory;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;

class TaskController extends Controller
{
    protected Task $task;
    protected TaskHistory $task_history;
    protected User $user;
    protected $userData;
    public function __construct(User $user, Task $task, TaskHistory $task_history)
    {
        $this->user = $user;
        $this->task = $task;
        $this->task_history = $task_history;
        $this->userData = Auth::user();
    }

    public function index()
    {
        $tasks = $this->task->getTasks($this->userData->organization_id);
        $task_history = $this->task_history->getTaskHistories($this->userData->organization_id);
        $data = [
            'tasks' => $tasks,
            'task_history' => $task_history,
        ];
        return apiResponse($data, 'Tasks fetched successfully');
    }

    public function store(StoreTaskRequest $request)
    {
        $task = $this->task->storeTask($request, $this->userData);
        if ($task === "not found") {
            return apiResponse(null, 'Organization not found.', false, 404);
        }
        if (!$task) {
            return apiResponse(null, 'Task creation failed', false, 404);
        }
        return apiResponse($task, 'Task created successfully', true, 201);
    }

    public function show($id)
    {
        $task = $this->task->showTask($id, $this->userData->organization_id);
        if (!$task)
            apiResponse(null, 'Organization not found', false, 404);

        return apiResponse(
            $task,
            'Task details fetched successfully'
        );
    }

    public function update(UpdateTaskRequest $request, Task $task)
    {
        $updated = $this->task->updateTask($request, $task, $this->userData);
        if ($updated === null) {
            return apiResponse(null, 'Task not found.', false, 404);
        }
        if (!$updated) {
            return apiResponse(null, 'Failed to update task.', false, 500);
        }
        return apiResponse($updated, 'Task updated successfully');
    }

    public function destroy(Request $request, Task $task)
    {
        $organization_id = $this->userData->organization_id;

        if ($task->organization_id !== $organization_id) {
            return apiResponse(null, 'Task not found', false, 404);
        }

        DB::transaction(function () use ($request, $task, $organization_id) {

            // Delete subtasks if requested
            if ($request->boolean('delete_subtasks')) {
                $this->task->deleteSubtasks($task);
            }

            $project_id = $task->project_id;
            $status_id = $task->status_id;
            $position = $task->position;

            // Delete the main task
            $task->delete();

            // Shift positions of succeeding tasks in the same project/status column
            $this->task->where('organization_id', $organization_id)
                ->where('project_id', $project_id)
                ->where('status_id', $status_id)
                ->where('position', '>', $position)
                ->orderBy('position', 'ASC')
                ->each(function ($t) {
                    $t->decrement('position');
                });
        });
        return apiResponse('', 'Task deleted successfully');
    }


    public function move(Request $request, Task $task)
    {

        $validated = $request->validate([
            'status_id'   => 'required|exists:task_statuses,id',
            'position'    => 'required|integer|min:1',
        ]);

        $affectedTasks = $task->updateTaskPosition(
            $task,
            $validated['status_id'],
            $validated['position'],
            $this->userData->organization_id
        );

        return apiResponse(
            $affectedTasks,
            'Task position updated successfully.'
        );
    }
}
