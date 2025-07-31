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

    public function getTaskHistories($organization_id)
    {
        return TaskHistoryResource::collection($this->with(['task:id,title', 'changedBy:id,name,email'])
            ->where('organization_id', $organization_id)
            ->orderBy('id', 'ASC')->get());
    }
}
