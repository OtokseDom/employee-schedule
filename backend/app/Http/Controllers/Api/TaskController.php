<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreTaskRequest;
use App\Http\Requests\UpdateTaskRequest;
use App\Http\Resources\TaskResource;
use App\Models\Task;

class TaskController extends Controller
{
    public function index()
    {
        $tasks = Task::with(['assignee:id,name,email'])->orderBy('id', 'DESC')->get();
        return TaskResource::collection($tasks);
    }

    public function store(StoreTaskRequest $request)
    {
        $task = Task::create($request->validated());
        $task->load(['assignee:id,name,email']);
        return new TaskResource($task);
    }

    public function show(Task $task)
    {
        $task->load(['assignee:id,name,email']);
        return new TaskResource($task);
    }

    public function update(UpdateTaskRequest $request, Task $task)
    {
        $task->update($request->validated());
        $task->load(['assignee:id,name,email']);
        return new TaskResource($task);
    }

    public function destroy(Task $task)
    {
        $task->delete();
        return response()->json(['message' => 'Task successfully deleted'], 200);
    }
}