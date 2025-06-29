<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Category;
use App\Http\Requests\StoreCategoryRequest;
use App\Http\Requests\UpdateCategoryRequest;
use App\Http\Resources\CategoryResource;
use Illuminate\Support\Facades\DB;

class CategoryController extends Controller
{
    public function index()
    {
        // $categories = Category::orderBy("id", "DESC")->paginate(10);
        $categories = Category::orderBy("id", "DESC")->get();

        return apiResponse($categories, 'Categories fetched successfully');
        // return response(compact('categories'));
    }

    public function store(StoreCategoryRequest $request)
    {
        $data = $request->validated();
        $category = Category::create($data);

        if (!$category) {
            return apiResponse(null, 'Category creation failed', false, 404);
        }
        return apiResponse(new CategoryResource($category), 'Category created successfully', true, 201);
        // return response(new CategoryResource($category), 201);
    }

    public function show(Category $category)
    {
        $categoryDetails = DB::table('categories')->where('id', $category->id)->first();


        if (!$categoryDetails) {
            return apiResponse(null, 'Category not found', false, 404);
        }
        return apiResponse($categoryDetails, 'Category details fetched successfully');
        // return response()->json(['data' => $categoryDetails]);
    }

    public function update(UpdateCategoryRequest $request, Category $category)
    {
        $data = $request->validated();
        // $category->update($data);
        if (!$category->update($data)) {
            return apiResponse(null, 'Failed to update category.', false, 500);
        }

        return apiResponse(new CategoryResource($category), 'Category updated successfully');
        // return new CategoryResource($category);
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
        $categories = Category::orderBy("id", "DESC")->get();

        return apiResponse(CategoryResource::collection($categories), 'Category deleted successfully');
        // return response(CategoryResource::collection($categories), 200);
    }
}