<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ProductVariation extends Model
{
    use HasFactory;
    protected $fillable = [
        "product_id",
        "SKU",
        "name",
        "short_name",
        "barcode"
    ];
    public function product()
    {
        return $this->belongsTo(Product::class);
    }
    public function units()
    {
        return $this->hasMany(ProductUnit::class);
    }
}
