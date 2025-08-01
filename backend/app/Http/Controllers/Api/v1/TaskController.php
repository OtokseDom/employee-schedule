<?php

namespace App\Http\Controllers\Api\v1;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreTaskRequest;
use App\Http\Requests\UpdateTaskRequest;
use App\Models\Task;
use App\Models\TaskHistory;
use App\Models\User;
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
        $task = $this->task->storeTask($request, $this->userData);
        return apiResponse($task, 'Task created successfully', true, 201);
    }

    public function show($id)
    {
        $task = $this->task->showTask($id, $this->userData->organization_id);
        return apiResponse($task, 'Task details fetched successfully');
    }

    public function update(UpdateTaskRequest $request, Task $task)
    {
        $task = $this->task->updateTask($request, $task, $this->userData);
        return apiResponse($task, 'Task updated successfully');
    }

    public function destroy(Task $task)
    {
        $task->delete();
        return apiResponse('', 'Task deleted successfully');
    }
}
