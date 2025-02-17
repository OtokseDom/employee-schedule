<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Storage extends Model
{
    use HasFactory;
    protected $fillable = [
        "warehouse_id",
        "name",
        "code",
        "type",
        "description",
        "capacity",
        "dimension",
        "weight_capacity",
        "status",
    ];
    public function warehouse()
    {
        return $this->belongsTo(Warehouse::class);
    }
}
