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
        "user_id",
        "date",
        "shift_start",
        "shift_end",
        "status"
    ];
    public function event()
    {
        return $this->belongsTo(Event::class);
    }
    public function user()
    {
        return $this->belongsTo(User::class);
    }
}