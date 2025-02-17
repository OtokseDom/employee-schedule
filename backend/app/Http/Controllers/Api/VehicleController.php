<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Vehicle;
use App\Http\Requests\StoreVehicleRequest;
use App\Http\Requests\UpdateVehicleRequest;
use App\Http\Resources\VehicleResource;

class VehicleController extends Controller
{
    public function index()
    {
        // $vehicles = Vehicle::orderBy("id", "DESC")->paginate(10);
        $vehicles = Vehicle::orderBy("id", "DESC")->get();
        return response(compact('vehicles'));
    }

    public function store(StoreVehicleRequest $request)
    {
        $data = $request->validated();
        $vehicles = Vehicle::create($data);
        return response(new VehicleResource($vehicles), 201);
    }

    public function show(Vehicle $vehicle)
    {
        return new VehicleResource($vehicle);
    }

    public function update(UpdateVehicleRequest $request, Vehicle $vehicle)
    {
        $data = $request->validated();
        $vehicle->update($data);
        return new VehicleResource($vehicle);
    }

    public function destroy(Vehicle $vehicle)
    {
        // TODO::validate if used
        $vehicle->delete();
        return response()->json(['message' => 'Vehicle successfully deleted'], 200);
    }
}
