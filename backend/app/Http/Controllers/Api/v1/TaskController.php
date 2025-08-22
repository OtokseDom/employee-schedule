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
        return apiResponse(
            $this->task->storeTask($request, $this->userData),
            'Task created successfully',
            true,
            201
        );
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
        return apiResponse(
            $this->task->updateTask($request, $task, $this->userData),
            'Task updated successfully'
        );
    }

    public function destroy(Request $request, Task $task)
    {
        // Delete subtasks or not
        if ($request->boolean('delete_subtasks')) {
            if (!$this->task->deleteSubtasks($task)) {
                return apiResponse(null, 'Failed to delete subtasks', false, 500);
            }
        }

        if (!$task->delete()) {
            return apiResponse(null, 'Failed to delete task.', false, 500);
        }
        return apiResponse('', 'Task deleted successfully');
    }
}