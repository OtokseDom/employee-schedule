<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Subtask extends Model
{
    use HasFactory;

    protected $fillable = [
        'parent_id',
        'child_id'
    ];

    public function parent()
    {
        return $this->belongsTo(Task::class, 'parent_id');
    }

    public function child()
    {
        return $this->belongsTo(Task::class, 'child_id');
    }
}
