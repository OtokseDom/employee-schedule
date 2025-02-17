<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Supplier;
use App\Http\Requests\StoreSupplierRequest;
use App\Http\Requests\UpdateSupplierRequest;
use App\Http\Resources\SupplierResource;

class SupplierController extends Controller
{
    public function index()
    {
        // $suppliers = Supplier::orderBy("id", "DESC")->paginate(10);
        $suppliers = Supplier::orderBy("id", "DESC")->get();

        return response(compact('suppliers'));
    }

    public function store(StoreSupplierRequest $request)
    {
        $data = $request->validated();

        $suppliers = Supplier::create($data);
        return response(new SupplierResource($suppliers), 201);
    }

    public function show(Supplier $supplier)
    {
        return response(new SupplierResource($supplier), 200);
    }

    public function update(UpdateSupplierRequest $request, Supplier $supplier)
    {
        $data = $request->validated();
        $supplier->update($data);

        return new SupplierResource($supplier);
    }

    public function destroy(Supplier $supplier)
    {
        // TODO::validate if used
        $supplier->delete();
        return response()->json(['message' => 'Supplier successfully deleted'], 200);
    }
}
