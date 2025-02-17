<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Supplier extends Model
{
    use HasFactory;
    protected $fillable = [
        "name",
        "type", // 1=CASH; 2=CREDIT
        "category", // 1=supplier; 2=vendor
        "phone",
        "email",
        "image",
        "address",
    ];
}
