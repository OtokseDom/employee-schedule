<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreTaskHistoryRequest;
use App\Http\Requests\UpdateTaskHistoryRequest;
use App\Http\Resources\TaskHistoryResource;
use App\Models\TaskHistory;
// TODO: use apiResponse
class TaskHistoryController extends Controller
{
    public function index()
    {
        $taskHistories = TaskHistory::with(['task:id,title', 'changedBy:id,name,email'])->orderBy('id', 'DESC')->get();
        return apiResponse(TaskHistoryResource::collection($taskHistories), 'Task history fetched successfully');
        // return TaskHistoryResource::collection($taskHistories);
    }

    public function store(StoreTaskHistoryRequest $request)
    {
        $taskHistory = TaskHistory::create($request->validated());
        $taskHistory->load(['task:id,title', 'changedBy:id,name,email']);
        return apiResponse(new TaskHistoryResource($taskHistory), 'Task history created successfully');
        // return new TaskHistoryResource($taskHistory);
    }

    public function show(TaskHistory $taskHistory)
    {
        $taskHistory->load(['task:id,title', 'changedBy:id,name,email']);
        return apiResponse(new TaskHistoryResource($taskHistory), 'Task history details fetched successfully');
        // return new TaskHistoryResource($taskHistory);
    }

    public function update(UpdateTaskHistoryRequest $request, TaskHistory $taskHistory)
    {
        $taskHistory->update($request->validated());
        $taskHistory->load(['task:id,title', 'changedBy:id,name,email']);
        return apiResponse(new TaskHistoryResource($taskHistory), 'Task history updated successfully');
        // return new TaskHistoryResource($taskHistory);
    }

    public function destroy(TaskHistory $taskHistory)
    {
        $taskHistory->delete();
        return apiResponse('', 'Task history deleted successfully');
        // return response()->json(['message' => 'Task History successfully deleted'], 200);
    }
}
