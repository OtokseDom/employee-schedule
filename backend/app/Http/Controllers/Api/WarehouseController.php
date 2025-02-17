<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Warehouse;
use App\Http\Requests\StoreWarehouseRequest;
use App\Http\Requests\UpdateWarehouseRequest;
use App\Http\Resources\WarehouseResource;

class WarehouseController extends Controller
{
    public function index()
    {
        // $warehouses = Warehouse::orderBy("id", "DESC")->paginate(10);
        $warehouses = Warehouse::orderBy("id", "DESC")->get();
        return response(compact('warehouses'));
    }

    public function store(StoreWarehouseRequest $request)
    {
        $data = $request->validated();
        $warehouses = Warehouse::create($data);
        return response(new WarehouseResource($warehouses), 201);
    }

    public function show(Warehouse $warehouse)
    {
        return new WarehouseResource($warehouse);
    }

    public function update(UpdateWarehouseRequest $request, Warehouse $warehouse)
    {
        $data = $request->validated();
        $warehouse->update($data);
        return new WarehouseResource($warehouse);
    }

    public function destroy(Warehouse $warehouse)
    {
        // TODO::validate if used
        $warehouse->delete();
        return response()->json(['message' => 'Warehuose successfully deleted'], 200);
    }
}
