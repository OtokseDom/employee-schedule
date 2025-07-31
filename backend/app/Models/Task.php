<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Task extends Model
{
    use HasFactory;

    protected $fillable = [
        'organization_id',
        'category_id',
        'title',
        'description',
        'expected_output',
        'assignee_id',
        'status',
        'start_date',
        'end_date',
        'start_time',
        'end_time',
        'time_estimate',
        'time_taken',
        'delay',
        'delay_reason',
        'performance_rating',
        'remarks',
    ];

    protected $casts = [
        'start_date' => 'date',
        'end_date' => 'date',
    ];

    // Relationship with User (Assignee)
    public function assignee()
    {
        return $this->belongsTo(User::class);
    }

    // Relationship with TaskHistory
    public function taskHistories()
    {
        return $this->hasMany(\App\Models\TaskHistory::class, 'task_id');
    }

    // Relationship with Category
    public function category()
    {
        return $this->belongsTo(Category::class);
    }

    public function getTasks($organization_id)
    {
        return $this->with(['assignee:id,name,email,role,position', 'category'])
            ->where('organization_id', $organization_id)
            ->orderBy('id', 'DESC')->get();
    }
}
