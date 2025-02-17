<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Contact extends Model
{
    use HasFactory;
    protected $fillable = [
        "name",
        "country",
        "region",
        "city",
        "address_line",
        "phone",
        "email",
        "description",
    ];
}
