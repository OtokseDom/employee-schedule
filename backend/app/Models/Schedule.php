<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Schedule extends Model
{
    use HasFactory;
    // use HasFactory;
    protected $fillable = [
        "event_id",
        "employee_id",
        "shift_start",
        "shift_end",
        "status"
    ];
    public function event()
    {
        return $this->belongsTo(Event::class);
    }
    public function employee()
    {
        return $this->belongsTo(Employee::class);
    }
}