<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Customer extends Model
{
    use HasFactory;
    protected $fillable = [
        "type", // 1=CASH; 2=CREDIT
        "category", // 1=personal; 2=business
        "first_name",
        "middle_name",
        "last_name",
        "address",
        "phone",
        "email",
        "image",
    ];
}
