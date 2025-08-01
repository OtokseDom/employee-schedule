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
        $category = $this->create($request->validated());
        if (!$category) {
            return apiResponse(null, 'Category creation failed', false, 404);
        }
        return new CategoryResource($category);
    }

    public function showCategory($organization_id, $category_id)
    {
        $category = $this->where('id', $category_id)
            ->where('organization_id', $organization_id)
            ->first();

        if (!$category) {
            return apiResponse(null, 'Category not found', false, 404);
        }
        return $category;
    }

    public function updateCategory($request, $category)
    {
        if (!$category->update($request->validated())) {
            return apiResponse(null, 'Failed to update category.', false, 500);
        }
        return new CategoryResource($category);
    }

    public function deleteCategory($category, $organization_id)
    {
        // Check if the category has existing tasks assigned
        $hasTasks = Task::where('category_id', $category->id)->exists();
        if ($hasTasks) {
            return apiResponse(null, 'Category cannot be deleted because they have assigned tasks.', false, 400);
        }
        if (!$category->delete()) {
            return apiResponse(null, 'Failed to delete category.', false, 500);
        }
        // Fetch the updated categories again
        $categories = $this->where('organization_id', $organization_id)->orderBy("id", "DESC")->get();
        return CategoryResource::collection($categories);
    }
}
