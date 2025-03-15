<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Task extends Model
{
    use HasFactory;

    protected $fillable = [
        'category',
        'title',
        'description',
        'expected_output',
        'assignee_id',
        'status',
        'start_date',
        'end_date',
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
    public function histories()
    {
        return $this->hasMany(TaskHistory::class);
    }
}