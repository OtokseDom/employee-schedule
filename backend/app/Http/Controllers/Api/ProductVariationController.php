<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\ProductVariation;
use App\Http\Requests\StoreProductVariationRequest;
use App\Http\Requests\UpdateProductVariationRequest;
use App\Http\Resources\ProductResource;
use App\Http\Resources\ProductVariationResource;
use App\Models\Product;
use App\Models\ProductUnit;
use App\Models\Unit;
use Illuminate\Support\Arr;
use Illuminate\Support\Facades\DB;

class ProductVariationController extends Controller
{
    public function index()
    {
        $product_variations = ProductVariation::with(['product:id,highlight,specification,description'])->orderBy("id", "DESC")->get();

        return response(compact('product_variations'));
    }

    public function store(StoreProductVariationRequest $request)
    {
        $data = $request->validated();

        // Start a transaction to ensure data integrity
        DB::beginTransaction();
        try {
            // 1. Create the product (common fields)
            $productData = Arr::only($data, ['highlight', 'specification', 'description']); // Form fields
            $product = Product::create($productData);

            // 2. Create variations and units
            $productVariations = $data['variations'];
            foreach ($productVariations as $productVariation) {
                // 2.1 Create the variation and associate it with the product
                $productVariation['product_id'] = $product->id;
                $variation = ProductVariation::create($productVariation);

                // 3. Create product units for each variation
                $productUnits = $productVariation['product_units'];
                foreach ($productUnits as $productUnit) {
                    // 3.1 Retrieve the unit by id 
                    $unit = Unit::where('id', $productUnit['unit_id'])->first();

                    // Ensure the unit exists before creating the unit in the product_units table
                    if ($unit) {
                        $productUnit['unit_id'] = $unit->id; // Assign the unit_id to the data
                        // 3.2 Create the product unit and associate it with the variation
                        $productUnit['product_variation_id'] = $variation->id;
                        ProductUnit::create($productUnit);
                    } else {
                        // Handle the case where the unit code doesn't exist
                        // You can throw an error or handle it according to your application's logic
                        throw new \Exception("Unit with id {$productUnit['unit_id']} not found.");
                    }
                }
            }

            // Commit the transaction if everything is successful
            DB::commit();

            // Eager load the relationships after creation
            $product->load(['variations.units']);

            // Return the response with the product resource including variations and units
            return response(new ProductResource($product), 201);
        } catch (\Exception $e) {
            // Rollback in case of error
            DB::rollBack();

            // Return an error response
            // return response()->json(['error' => $e->getMessage()], 500);
            return response($e);
        }
    }

    public function show(ProductVariation $productVariation)
    {
        // Eager load relationships
        $productVariation->load('product');
        return response(new ProductVariationResource($productVariation), 200);
    }

    public function update(UpdateProductVariationRequest $request, ProductVariation $productVariation)
    {
        $data = $request->validated();
        $productVariation->update($data);

        return new ProductVariationResource($productVariation);
    }

    public function destroy(ProductVariation $productVariation)
    {
        // TODO: Validate if has stock
        $productVariation->delete();
        return response()->json(['message' => 'Product Variation successfully deleted'], 200);
    }
}
