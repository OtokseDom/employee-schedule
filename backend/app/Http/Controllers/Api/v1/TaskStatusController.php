<?php

namespace App\Http\Controllers\Api\v1;

use App\Http\Controllers\Controller;
use App\Models\TaskStatus;
use App\Http\Requests\StoreTaskStatusRequest;
use App\Http\Requests\UpdateTaskStatusRequest;
use App\Http\Resources\TaskStatusResource;
use Illuminate\Support\Facades\Auth;

class TaskStatusController extends Controller
{
    protected TaskStatus $task_status;
    protected $userData;
    public function __construct(TaskStatus $task_status)
    {
        $this->task_status = $task_status;
        $this->userData = Auth::user();
    }

    public function index()
    {
        $task_statuses = $this->task_status->getTaskStatuses($this->userData->organization_id);
        return apiResponse($task_statuses, 'Task statuses fetched successfully');
    }

    public function store(StoreTaskStatusRequest $request)
    {
        $task_status = $this->task_status->storeTaskStatus($request);
        if (!$task_status) {
            return apiResponse(null, 'Task status creation failed', false, 404);
        }
        return apiResponse(new TaskStatusResource($task_status), 'Task status created successfully', true, 201);
    }

    public function show(TaskStatus $task_status)
    {
        $details = $this->task_status->showTaskStatus($this->userData->organization_id, $task_status->id);
        if (!$details) {
            return apiResponse(null, 'Task status not found', false, 404);
        }
        return apiResponse(new TaskStatusResource($details), 'Task status details fetched successfully');
    }

    public function update(UpdateTaskStatusRequest $request, TaskStatus $task_status)
    {
        $result = $this->task_status->updateTaskStatus($request, $task_status);

        if ($result === false) {
            return apiResponse(null, 'System status cannot be updated.', false, 400);
        }
        if ($result === null) {
            return apiResponse(null, 'Failed to update task status.', false, 500);
        }
        return apiResponse(new TaskStatusResource($task_status), 'Task status updated successfully');
    }

    public function destroy(TaskStatus $task_status)
    {
        $result = $this->task_status->deleteTaskStatus($task_status);
        if ($result === "system") {
            return apiResponse(null, 'System status cannot be deleted.', false, 400);
        }
        if ($result === false) {
            return apiResponse(null, 'Task Status cannot be deleted because they have assigned tasks.', false, 400);
        }
        if ($result === null) {
            return apiResponse(null, 'Failed to delete task status.', false, 500);
        }
        return apiResponse('', 'Task Status deleted successfully');
    }
}