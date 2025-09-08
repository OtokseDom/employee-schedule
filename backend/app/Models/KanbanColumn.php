<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class KanbanColumn extends Model
{
    use HasFactory;

    protected $fillable = [
        'project_id',
        'task_status_id',
        'position'
    ];

    // Relationship with Project
    public function project()
    {
        return $this->belongsTo(Project::class);
    }
    // Relationship with Task Statuses
    public function status()
    {
        return $this->belongsTo(TaskStatus::class);
    }
}
