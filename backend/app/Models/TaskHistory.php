<?php

namespace App\Models;

use App\Http\Resources\TaskHistoryResource;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class TaskHistory extends Model
{
    use HasFactory;

    protected $fillable = [
        'organization_id',
        'task_id',
        'status',
        'changed_by',
        'changed_at',
        'remarks',
    ];

    protected $casts = [
        'changed_at' => 'datetime',
    ];

    // Relationship with Task
    public function task()
    {
        return $this->belongsTo(Task::class);
    }

    // Relationship with User (Who made the change)
    public function changedBy()
    {
        return $this->belongsTo(User::class, 'changed_by');
    }

    /* -------------------------------------------------------------------------- */
    /*                          Controller Logic Function                         */
    /* -------------------------------------------------------------------------- */
    public function getTaskHistories($organization_id)
    {
        return TaskHistoryResource::collection($this->with(['task:id,title', 'changedBy:id,name,email'])
            ->where('organization_id', $organization_id)
            ->orderBy('id', 'ASC')->get());
    }

    public function storeTaskHistory($request)
    {
        $taskHistory = $this->create($request->validated());
        $taskHistory->load(['task:id,title', 'changedBy:id,name,email']);
        return new TaskHistoryResource($taskHistory);
    }

    public function showTaskHistory($id, $organization_id)
    {
        $task_history = $this->with(['task:id,title', 'changedBy:id,name'])
            ->where('id', $id)
            ->where('organization_id', $organization_id)
            ->first();
        if (!$task_history || $task_history->organization_id !== $organization_id)
            return null;
        return new TaskHistoryResource($task_history);
    }

    public function updateTaskHistory($request, $task_history)
    {
        $task_history->update($request->validated());
        $task_history->load(['task:id,title', 'changedBy:id,name,email']);
        return new TaskHistoryResource($task_history);
    }
}
