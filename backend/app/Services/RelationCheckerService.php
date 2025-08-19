<?php

namespace App\Services;

use App\Http\Resources\TaskResource;
use App\Models\Task;
use Illuminate\Support\Facades\Auth;

class RelationCheckerService
{
    protected Task $task;
    protected $organization_id;
    public function __construct(Task $task)
    {
        $this->task = $task;
        $this->organization_id = Auth::user()->organization_id;
    }
    // TODO: Add other checks
    public function checkTaskStatus($value)
    {
        return $this->task->where('status_id', $value)->where('organization_id', $this->organization_id)->exists();
    }

    public function checkTaskCategory($value)
    {
        return $this->task->where('category_id', $value)->where('organization_id', $this->organization_id)->exists();
    }

    public function checkTaskProject($value)
    {
        return $this->task->where('project_id', $value)->where('organization_id', $this->organization_id)->exists();
    }

    public function checkTaskAssignee($value)
    {
        return $this->task->where('assignee_id', $value)->where('organization_id', $this->organization_id)->exists();
    }
    public function checkTaskChildren($value)
    {
        return $this->task->where('id', $value)->where('organization_id', $this->organization_id)->whereHas('children')->exists();
    }
}
