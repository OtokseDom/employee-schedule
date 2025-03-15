<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class PerformanceReport extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'average_rating',
        'total_tasks',
        'tasks_on_time',
        'tasks_delayed',
        'tasks_pending',
        'tasks_completed',
        'tasks_in_progress',
        'tasks_cancelled',
        'tasks_on_hold',
        'assessment_date',
    ];

    protected $casts = [
        'assessment_date' => 'date',
    ];

    // Relationship with User
    public function user()
    {
        return $this->belongsTo(User::class);
    }
}