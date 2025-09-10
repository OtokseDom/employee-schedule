<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class TaskStatus extends Model
{
    use HasFactory;

    protected $fillable = [
        'organization_id',
        'name',
        'description',
        'color',
    ];

    // Relationship with Organization
    public function organization()
    {
        return $this->belongsTo(Organization::class);
    }

    /* -------------------------------------------------------------------------- */
    /*                         Controller Logic Functions                         */
    /* -------------------------------------------------------------------------- */
    public function getTaskStatuses($organization_id)
    {
        return $this->orderBy("id", "DESC")->where('organization_id', $organization_id)->get();
    }

    // Add status should populate kanban columns with correct position
    public function storeTaskStatus($request, $userData)
    {
        if ($request->organization_id !== $userData->organization_id) {
            return "not found";
        }
        return $this->create($request->validated());
    }

    public function showTaskStatus($organization_id, $status_id)
    {
        return $this->where('id', $status_id)
            ->where('organization_id', $organization_id)
            ->first();
    }

    public function updateTaskStatus($request, $task_status, $userData)
    {
        if ($task_status->organization_id !== $userData->organization_id || $request->organization_id !== $userData->organization_id) {
            return "not found";
        }
        // Validate if updating system status
        $taskStatus = $this->find($task_status->id);
        $systemStatuses = [
            "Pending",
            "In Progress",
            "Completed",
            "For Review",
            "On Hold",
            "Delayed",
            "Cancelled",
        ];
        if ($taskStatus && in_array($taskStatus->name, $systemStatuses)) {
            return false;
        }
        $updated = $task_status->update($request->validated());
        if (!$updated) {
            return null;
        }
        return $updated;
    }

    public function deleteTaskStatus($taskStatus, $userData)
    {
        if ($taskStatus->organization_id !== $userData->organization_id) {
            return "not found";
        }
        if (in_array($taskStatus->name, ["Pending", "In Progress", "Completed", "For Review", "On Hold", "Delayed", "Cancelled"])) {
            return "system";
        }
        if (Task::where('status_id', $taskStatus->id)->exists()) {
            return false;
        }
        if (!$taskStatus->delete()) {
            return null;
        }
        return true;
    }
}
