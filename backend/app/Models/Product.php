<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Product extends Model
{
    use HasFactory;
    protected $fillable = [
        "highlight",
        "specification",
        "description",
    ];
    public function variations()
    {
        return $this->hasMany(ProductVariation::class);
    }
}

// Product has multiple variations -> product_variation table has product_id
// Variation has multiple product_units -> product_unit table has variation_id