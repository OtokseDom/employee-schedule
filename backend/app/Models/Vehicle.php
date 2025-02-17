<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Vehicle extends Model
{
    use HasFactory;
    protected $fillable = [
        "name",
        "type",
        "make",
        "model",
        "plate_number",
        "vehicle_id",
        "capacity",
        "dimension",
        "weight_capacity",
    ];
}
