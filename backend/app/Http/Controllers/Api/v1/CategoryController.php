<?php

namespace App\Http\Controllers\Api\v1;

use App\Http\Controllers\Controller;
use App\Models\Category;
use App\Http\Requests\StoreCategoryRequest;
use App\Http\Requests\UpdateCategoryRequest;
use App\Http\Resources\CategoryResource;
use Illuminate\Support\Facades\Auth;

class CategoryController extends Controller
{
    protected Category $category;
    protected $userData;
    public function __construct(Category $category)
    {
        $this->category = $category;
        $this->userData = Auth::user();
    }

    public function index()
    {
        $categories = $this->category->getCategories($this->userData->organization_id);
        return apiResponse($categories, 'Categories fetched successfully');
    }

    public function store(StoreCategoryRequest $request)
    {
        $category = $this->category->storeCategory($request);
        if (!$category) {
            return apiResponse(null, 'Category creation failed', false, 404);
        }
        return apiResponse(new CategoryResource($category), 'Category created successfully', true, 201);
    }

    public function show(Category $category)
    {
        $details = $this->category->showCategory($this->userData->organization_id, $category->id);
        if (!$details) {
            return apiResponse(null, 'Category not found', false, 404);
        }
        return apiResponse(new CategoryResource($details), 'Category details fetched successfully');
    }

    public function destroy(Category $category)
    {
        $result = $this->category->deleteCategory($category);
        if ($result === false) {
            return apiResponse(null, 'Category cannot be deleted because they have assigned tasks.', false, 400);
        }
        if ($result === null) {
            return apiResponse(null, 'Failed to delete category.', false, 500);
        }
        return apiResponse('', 'Category deleted successfully');
    }
}
