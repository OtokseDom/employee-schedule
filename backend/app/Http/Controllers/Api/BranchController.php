<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Branch;
use App\Http\Requests\StoreBranchRequest;
use App\Http\Requests\UpdateBranchRequest;
use App\Http\Resources\BranchResource;

class BranchController extends Controller
{
    public function index()
    {
        // $branches = Branch::orderBy("id", "DESC")->paginate(10);
        $branches = Branch::orderBy("id", "DESC")->get();

        return response(compact('branches'));
    }

    public function store(StoreBranchRequest $request)
    {
        $data = $request->validated();

        $branches = Branch::create($data);
        return response(new BranchResource($branches), 201);
    }

    public function show(Branch $branch)
    {
        return new BranchResource($branch);
    }

    public function update(UpdateBranchRequest $request, Branch $branch)
    {
        $data = $request->validated();
        $branch->update($data);

        return new BranchResource($branch);
    }

    public function destroy(Branch $branch)
    {
        // TODO::validate if used
        $branch->delete();
        return response()->json(['message' => 'Branch successfully deleted'], 200);
    }
}
