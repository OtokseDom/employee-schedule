<?php

namespace App\Models;

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

    // Relationship with Organization
    public function organization()
    {
        return $this->belongsTo(Organization::class);
    }

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
}
