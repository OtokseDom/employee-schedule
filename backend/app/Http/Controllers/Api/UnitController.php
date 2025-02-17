<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Unit;
use App\Http\Requests\StoreUnitRequest;
use App\Http\Requests\UpdateUnitRequest;
use App\Http\Resources\UnitResource;

class UnitController extends Controller
{
    public function index()
    {
        // $units = Unit::orderBy("id", "DESC")->paginate(10);
        $units = Unit::orderBy("id", "DESC")->get();

        return response(compact('units'));
    }

    public function store(StoreUnitRequest $request)
    {
        $data = $request->validated();

        $units = Unit::create($data);
        return response(new UnitResource($units), 201);
    }

    public function show(Unit $unit)
    {
        return response(new UnitResource($unit), 200);
    }

    public function update(UpdateUnitRequest $request, Unit $unit)
    {
        $data = $request->validated();
        $unit->update($data);

        return new UnitResource($unit);
    }

    public function destroy(Unit $unit)
    {
        // TODO::validate if used
        $unit->delete();
        return response()->json(['message' => 'Unit successfully deleted'], 200);
    }
}
