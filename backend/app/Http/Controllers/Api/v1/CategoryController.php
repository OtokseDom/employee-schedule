<?php

namespace App\Http\Controllers\Api\v1;

use App\Http\Controllers\Controller;
use App\Models\Category;
use App\Http\Requests\StoreCategoryRequest;
use App\Http\Requests\UpdateCategoryRequest;
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
        return apiResponse($category, 'Category created successfully', true, 201);
    }

    public function show(Category $category)
    {
        $details = $this->category->showCategory($this->userData->organization_id, $category->id);
        return apiResponse($details, 'Category details fetched successfully');
    }

    public function update(UpdateCategoryRequest $request, Category $category)
    {
        $category = $this->category->updateCategory($request, $category);
        return apiResponse($category, 'Category updated successfully');
    }

    public function destroy(Category $category)
    {
        $categories = $this->category->deleteCategory($category, $this->userData->organization_id);
        return apiResponse($categories, 'Category deleted successfully');
    }
}
