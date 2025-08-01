<?php

namespace App\Http\Controllers\Api\v1;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreTaskHistoryRequest;
use App\Http\Requests\UpdateTaskHistoryRequest;
use App\Http\Resources\TaskHistoryResource;
use App\Models\TaskHistory;
use Illuminate\Support\Facades\Auth;

class TaskHistoryController extends Controller
{
    protected TaskHistory $task_history;
    protected $userData;
    public function __construct(TaskHistory $task_history)
    {
        $this->task_history = $task_history;
        $this->userData = Auth::user();
    }

    public function index()
    {
        $taskHistories = $this->task_history->getTaskHistories($this->userData->organization_id);
        return apiResponse($taskHistories, 'Task history fetched successfully');
    }

    public function store(StoreTaskHistoryRequest $request)
    {
        $task_history = $this->task_history->storeTaskHistory($request);
        return apiResponse($task_history, 'Task history created successfully');
    }

    public function show($id)
    {
        $task_history = $this->task_history->showTaskHistory($id, $this->userData->organization_id);
        return apiResponse($task_history, 'Task history details fetched successfully');
    }

    public function update(UpdateTaskHistoryRequest $request, TaskHistory $task_history)
    {
        $details = $this->task_history->updateTaskHistory($request, $task_history);
        return apiResponse($details, 'Task history updated successfully');
    }

    public function destroy(TaskHistory $taskHistory)
    {
        $taskHistory->delete();
        return apiResponse('', 'Task history deleted successfully');
    }
}
