<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreTaskHistoryRequest;
use App\Http\Requests\UpdateTaskHistoryRequest;
use App\Http\Resources\TaskHistoryResource;
use App\Models\TaskHistory;
use Illuminate\Support\Facades\Auth;

class TaskHistoryController extends Controller
{
    public static function index()
    {
        $taskHistories = TaskHistory::with(['task:id,title', 'changedBy:id,name,email'])
            ->where('organization_id', Auth::user()->organization_id)
            ->orderBy('id', 'ASC')->get();
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

    public function show($id)
    {
        $taskHistory = TaskHistory::with(['task:id,title', 'changedBy:id,name'])
            ->where('id', $id)
            ->where('organization_id', Auth::user()->organization_id)
            ->first();

        // Return API response when no task found
        if (!$taskHistory || $taskHistory->organization_id !== Auth::user()->organization_id)
            return apiResponse(null, 'Task history not found within your organization', false, 404);

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
