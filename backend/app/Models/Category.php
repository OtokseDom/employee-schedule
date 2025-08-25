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

    public function storeCategory($request, $userData)
    {
        if ($request->organization_id !== $userData->organization_id) {
            return "not found";
        }
        return $this->create($request->validated());
    }

    public function showCategory($organization_id, $category_id)
    {
        return $this->where('id', $category_id)
            ->where('organization_id', $organization_id)
            ->first();
    }

    public function updateCategory($request, $category, $userData)
    {
        // Validate org_id param AND payload
        if ($category->organization_id !== $userData->organization_id || $request->organization_id !== $userData->organization_id) {
            return "not found";
        }
        $updated = $category->update($request->validated());
        if (!$updated) {
            return null;
        }
        return $updated;
    }

    public function deleteCategory($category, $userData)
    {
        if ($category->organization_id !== $userData->organization_id) {
            return "not found";
        }
        if (Task::where('category_id', $category->id)->exists()) {
            return false;
        }
        if (!$category->delete()) {
            return null;
        }
        return true;
    }
}
