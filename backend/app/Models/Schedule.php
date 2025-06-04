<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Schedule extends Model
{
    use HasFactory;

    protected $fillable = [
        'title',
        'category',
        'start_date',
        'end_date',
        'start_time',
        'end_time',
        'description',
        'assignee',
        'status',
    ];

    public function assignee()
    {
        return $this->belongsTo(User::class, 'assignee');
    }
}