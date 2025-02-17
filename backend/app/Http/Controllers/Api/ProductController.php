<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Product;
use App\Http\Requests\StoreProductRequest;
use App\Http\Requests\UpdateProductRequest;
use App\Http\Resources\ProductResource;

class ProductController extends Controller
{
    public function index()
    {
        $products = Product::orderBy("id", "DESC")->get();

        return response(compact('products'));
    }

    public function store(StoreProductRequest $request)
    {
        $data = $request->validated();

        $products = Product::create($data);
        return response(new ProductResource($products), 201);
    }

    public function show($id)
    {

        // Eager load the variations and their related units
        $product = Product::with('variations.units')->find($id);

        if (!$product) {
            return response()->json(['message' => 'Product not found'], 404);
        }

        // Return the product resource with the eagerly loaded relationships
        return response(new ProductResource($product), 200);
        // Eager load relationships
        // $product->load('productVariations');
        // return response(new ProductResource($product), 200);
    }

    public function update(UpdateProductRequest $request, Product $product)
    {
        $data = $request->validated();
        $product->update($data);

        return new ProductResource($product);
    }

    public function destroy(Product $product)
    {
        // TODO::validate if has stock
        $product->delete();
        return response()->json(['message' => 'Product successfully deleted'], 200);
    }
}
