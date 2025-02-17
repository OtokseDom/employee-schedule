<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ProductUnit extends Model
{
    // use HasFactory;
    protected $fillable = [
        "product_variation_id",
        "unit_id",
        "is_base",
        "factor",
        "base_qty",
        "cost_price",
        "selling_price",
        "sale_price",
    ];
    public function productVariation()
    {
        return $this->belongsTo(ProductVariation::class);
    }
    public function unit()
    {
        return $this->belongsTo(Unit::class);
    }
}
