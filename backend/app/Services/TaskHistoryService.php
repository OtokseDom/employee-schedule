<?php

namespace App\Services;

use App\Models\Task;
use App\Models\TaskHistory;
use Illuminate\Support\Facades\Auth;

class TaskHistoryService
{
    /**
     * Record a history entry for a task.
     *
     * @param Task $task
     * @param array $changes
     * @param int $changedBy
     * @param int $organizationId
     * @return TaskHistory|null
     */
    public function record(Task $task, array $changes, int $changedBy, int $organizationId)
    {
        if (empty($changes)) {
            return null; // nothing to record
        }

        return $task->taskHistories()->create([
            'organization_id' => $organizationId,
            'task_id'         => $task->id,
            'status_id'       => $task->status_id,
            'changed_by'      => $changedBy,
            'changed_at'      => now(),
            'remarks'         => json_encode($changes),
        ]);
    }
}
