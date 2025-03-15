<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreTaskHistoryRequest;
use App\Http\Requests\UpdateTaskHistoryRequest;
use App\Http\Resources\TaskHistoryResource;
use App\Models\TaskHistory;

class TaskHistoryController extends Controller
{
    public function index()
    {
        $taskHistories = TaskHistory::with(['task:id,title', 'changedBy:id,name,email'])->orderBy('id', 'DESC')->get();
        return TaskHistoryResource::collection($taskHistories);
    }

    public function store(StoreTaskHistoryRequest $request)
    {
        $taskHistory = TaskHistory::create($request->validated());
        $taskHistory->load(['task:id,title', 'changedBy:id,name,email']);
        return new TaskHistoryResource($taskHistory);
    }

    public function show(TaskHistory $taskHistory)
    {
        $taskHistory->load(['task:id,title', 'changedBy:id,name,email']);
        return new TaskHistoryResource($taskHistory);
    }

    public function update(UpdateTaskHistoryRequest $request, TaskHistory $taskHistory)
    {
        $taskHistory->update($request->validated());
        $taskHistory->load(['task:id,title', 'changedBy:id,name,email']);
        return new TaskHistoryResource($taskHistory);
    }

    public function destroy(TaskHistory $taskHistory)
    {
        $taskHistory->delete();
        return response()->json(['message' => 'Task History successfully deleted'], 200);
    }
}