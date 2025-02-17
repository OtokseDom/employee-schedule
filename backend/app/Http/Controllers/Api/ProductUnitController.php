<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\ProductUnit;
use App\Http\Requests\StoreProductUnitRequest;
use App\Http\Requests\UpdateProductUnitRequest;
use App\Http\Resources\ProductUnitResource;
use Illuminate\Http\Exceptions\HttpResponseException;
use Illuminate\Support\Optional;
use PhpParser\Node\NullableType;

class ProductUnitController extends Controller
{
    public function index()
    {
        // $product_units = ProductUnit::orderBy("id", "DESC")->paginate(10);
        $product_units = ProductUnit::with(['productVariation:id,SKU,name,short_name,barcode', 'unit:id,code,description'])->orderBy("product_variation_id", "DESC")->get();
        return response(compact('product_units'));
    }

    public function store(StoreProductUnitRequest $request)
    {
        $data = $request->validated();

        // Check if a record with the same product_id and unit_id already exists
        $this->checkUniqueEntry($data['unit_id'], $data['product_variation_id']);

        $product_units = ProductUnit::create($data);
        return response(new ProductUnitResource($product_units), 201);
    }

    public function show(ProductUnit $product_unit)
    {
        // Eager load relationships
        $product_unit->load('productVariation', 'unit');
        return response(new ProductUnitResource($product_unit), 200);
    }

    function update(UpdateProductUnitRequest $request, ProductUnit $product_unit)
    {
        $data = $request->validated();

        // Check if a record with the same product_id and unit_id already exists (exclude self)
        $this->checkUniqueEntry($data['unit_id'], $data['product_variation_id']);
        // $this->checkUniqueEntryExcludingSelf($data['unit_id'], $data['product_variation_id'], $product_unit->id);

        $product_unit->update($data);

        return new ProductUnitResource($product_unit);
    }

    public function destroy(ProductUnit $product_unit)
    {
        $product_unit->delete();
        return response()->json(['message' => 'Product Unit successfully deleted'], 200);
    }

    /* -------------------------------------------------------------------------- */
    /*                            Custom-made functions                           */
    /* -------------------------------------------------------------------------- */

    public function checkUniqueEntry($unit_id, $product_variation_id = null)
    {

        $existingProductVariationUnit = ProductUnit::where('product_variation_id', $product_variation_id)
            ->where('unit_id', $unit_id)
            ->first();
        // Throw error if existing
        if ($existingProductVariationUnit) {
            throw new HttpResponseException(response()->json([
                'message' => 'A record with this product variation and unit already exists.',
            ], 409));
        }
    }

    // public function checkUniqueEntryExcludingSelf($product_id, $unit_id, $product_variation_id = null, $id)
    // {
    //     // Check if a record with the same product_id/product_variation_id and unit_id already exists (excluding self)
    //     if (!$product_variation_id) {
    //         $existingProductUnit = ProductUnit::where('product_id', $product_id)
    //             ->where('unit_id', $unit_id)
    //             ->where('id', '!=', $id)  // Exclude the current record being updated
    //             ->first();
    //         // Throw error if existing
    //         if ($existingProductUnit) {
    //             throw new HttpResponseException(response()->json([
    //                 'message' => 'A record with this product and unit already exists.',
    //             ], 409));
    //         }
    //     } else {
    //         $existingProductVariationUnit = ProductUnit::where('product_variation_id', $product_variation_id)
    //             ->where('unit_id', $unit_id)
    //             ->where('id', '!=', $id)  // Exclude the current record being updated
    //             ->first();
    //         // Throw error if existing
    //         if ($existingProductVariationUnit) {
    //             throw new HttpResponseException(response()->json([
    //                 'message' => 'A record with this product variation and unit already exists.',
    //             ], 409));
    //         }
    //     }
    // }
}
