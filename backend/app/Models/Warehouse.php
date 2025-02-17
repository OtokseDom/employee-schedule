<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Warehouse extends Model
{
    use HasFactory;
    protected $fillable = [
        "name",
        "code",
        "type",
        "description",
        "country",
        "city",
        "region",
        "address_line",
        "manager",
        "phone",
        "email",
    ];
}
