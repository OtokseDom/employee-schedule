<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Storage;
use App\Http\Requests\StoreStorageRequest;
use App\Http\Requests\UpdateStorageRequest;
use App\Http\Resources\StorageResource;

class StorageController extends Controller
{
    public function index()
    {
        // $storages = Storage::orderBy("id", "DESC")->paginate(10);
        $storages = Storage::with(['warehouse:id,name'])->orderBy("id", "DESC")->get();
        return response(compact('storages'));
    }

    public function store(StoreStorageRequest $request)
    {
        $data = $request->validated();
        $storages = Storage::create($data);
        return response(new StorageResource($storages), 201);
    }

    public function show(Storage $storage)
    {
        $storage->load('warehouse');
        return new StorageResource($storage);
    }

    public function update(UpdateStorageRequest $request, Storage $storage)
    {
        $data = $request->validated();
        $storage->update($data);
        return new StorageResource($storage);
    }

    public function destroy(Storage $storage)
    {
        // TODO::validate if used
        $storage->delete();
        return response()->json(['message' => 'Storage successfully deleted'], 200);
    }
}
