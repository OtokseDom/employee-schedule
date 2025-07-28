<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Category extends Model
{
    use HasFactory;

    protected $fillable = [
        'organization_id',
        'name',
        'description',
    ];

    // Relationship with Organization
    public function organization()
    {
        return $this->belongsTo(Organization::class);
    }

    public function getCategories($organization_id)
    {
        return  $this->orderBy("id", "DESC")->where('organization_id', $organization_id)->get();
    }
}
