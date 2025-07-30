<?php

namespace App\Http\Controllers\Api\v1;

use App\Http\Controllers\Controller;
use App\Models\Category;
use App\Http\Requests\StoreCategoryRequest;
use App\Http\Requests\UpdateCategoryRequest;
use App\Http\Resources\CategoryResource;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;

class CategoryController extends Controller
{

    // TODO: Add constructs on all controller
    // TODO: Move logic to models
    // TODO: Use common variables globally (auth)
    protected Category $category;
    protected $userData;
    public function __construct(Category $category)
    {
        $this->category = $category;
        $this->userData = Auth::user();
    }

    public function index()
    {
        return apiResponse($this->category->getCategories($this->userData->organization_id), 'Categories fetched successfully');
    }

    public function store(StoreCategoryRequest $request)
    {
        $category = Category::create($request->validated());

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
        return apiResponse($details, 'Category details fetched successfully');
    }

    public function update(UpdateCategoryRequest $request, Category $category)
    {
        if (!$category->update($request->validated())) {
            return apiResponse(null, 'Failed to update category.', false, 500);
        }

        return apiResponse(new CategoryResource($category), 'Category updated successfully');
    }

    public function destroy(Category $category)
    {
        // Check if the category has existing tasks assigned
        $hasTasks = DB::table('tasks')->where('category_id', $category->id)->exists();
        if ($hasTasks) {
            return apiResponse(null, 'Category cannot be deleted because they have assigned tasks.', false, 400);
        }
        if (!$category->delete()) {
            return apiResponse(null, 'Failed to delete category.', false, 500);
        }
        // Fetch the updated categories again
        $categories = Category::where('organization_id', Auth::user()->organization_id)->orderBy("id", "DESC")->get();

        return apiResponse(CategoryResource::collection($categories), 'Category deleted successfully');
    }
}
