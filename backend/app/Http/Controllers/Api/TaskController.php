<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreTaskRequest;
use App\Http\Requests\UpdateTaskRequest;
use App\Http\Resources\TaskResource;
use App\Models\Task;
use Illuminate\Support\Facades\Auth;

class TaskController extends Controller
{
    public function index()
    {
        $tasks = Task::with(['assignee:id,name,email,role,position', 'category'])
            ->where('organization_id', Auth::user()->organization_id)
            ->orderBy('id', 'DESC')->get();
        return apiResponse(TaskResource::collection($tasks), 'Tasks fetched successfully');
        // return TaskResource::collection($tasks);
    }

    public function store(StoreTaskRequest $request)
    {
        $task = Task::create($request->validated());
        $task->load(['assignee:id,name,email', 'category']);

        // Record Addition in Task History
        $task->taskHistories()->create([
            'organization_id' => Auth::user()->organization_id,
            'task_id' => $task->id,
            'status' => $task->status,
            'changed_by' => \Illuminate\Support\Facades\Auth::id(),
            'changed_at' => now(),
            'remarks' => "Task Added",
        ]);

        return apiResponse(new TaskResource($task), 'Task created successfully', true, 201);
        // return new TaskResource($task);
    }

    public function show($id)
    {
        // $task->load(['assignee:id,name,email,role,position', 'category']);

        $task = Task::with(['assignee:id,name,email,role,position', 'category'])
            ->where('id', $id)
            ->where('organization_id', Auth::user()->organization_id)
            ->first();
        // Return API response when no task found
        if (!$task || $task->organization_id !== Auth::user()->organization_id)
            return apiResponse(null, 'Task not found within your organization', false, 404);
        return apiResponse(new TaskResource($task), 'Task details fetched successfully');
        // return new TaskResource($task);
    }

    public function update(UpdateTaskRequest $request, Task $task)
    {
        $original = $task->getOriginal();
        $validated = $request->validated();
        $task->update($validated);
        $task->load(['assignee:id,name,email,role,position']);

        // Build changes as a JSON object
        $changes = [];
        foreach ($validated as $key => $value) {
            // Normalize date values for comparison
            if (in_array($key, ['start_date', 'end_date'])) {
                $orig = isset($original[$key]) ? date('Y-m-d', strtotime($original[$key])) : null;
                $val = $value ? date('Y-m-d', strtotime($value)) : null;
                if ($orig !== $val) {
                    $changes[$key] = [
                        'from' => $original[$key],
                        'to' => $value,
                    ];
                }
            } else {
                if (array_key_exists($key, $original) && $original[$key] != $value) {
                    $changes[$key] = [
                        'from' => $original[$key],
                        'to' => $value,
                    ];
                }
            }
        }
        // Record changes in Task History if there are any
        if (!empty($changes)) {
            // Record Update in Task History
            $task->taskHistories()->create([
                'organization_id' => Auth::user()->organization_id,
                'task_id' => $task->id,
                'status' => $task->status,
                'changed_by' => \Illuminate\Support\Facades\Auth::id(),
                'changed_at' => now(),
                'remarks' => $changes ? json_encode($changes) : null,
            ]);
        }

        return apiResponse(new TaskResource($task), 'Task updated successfully');
        // return new TaskResource($task);
    }

    public function destroy(Task $task)
    {
        $task->delete();
        return apiResponse('', 'Task deleted successfully');
        // return response()->json(['message' => 'Task successfully deleted'], 200);
    }
}
