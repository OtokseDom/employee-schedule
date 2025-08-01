<?php

namespace App\Models;

use App\Http\Resources\CategoryResource;
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

    /* -------------------------------------------------------------------------- */
    /*                         Controller Logic Functions                         */
    /* -------------------------------------------------------------------------- */
    public function getCategories($organization_id)
    {
        return $this->orderBy("id", "DESC")->where('organization_id', $organization_id)->get();
    }

    public function storeCategory($request)
    {
        return $this->create($request->validated());
    }

    public function showCategory($organization_id, $category_id)
    {
        return $this->where('id', $category_id)
            ->where('organization_id', $organization_id)
            ->first();
    }

    public function updateCategory($request, $category)
    {
        $category->update($request->validated());
        return $category;
    }

    public function deleteCategory($category, $organization_id)
    {
        if (Task::where('category_id', $category->id)->exists()) {
            return false;
        }
        if (!$category->delete()) {
            return null;
        }
        return $this->where('organization_id', $organization_id)->orderBy("id", "DESC")->get();
    }
}
