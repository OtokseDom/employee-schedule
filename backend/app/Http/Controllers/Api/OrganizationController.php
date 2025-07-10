<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreOrganizationRequest;
use App\Http\Requests\UpdateOrganizationRequest;
use App\Http\Resources\OrganizationResource;
use App\Models\Organization;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class OrganizationController extends Controller
{
    public function index()
    {
        // $organizations = Organization::orderBy("id", "DESC")->paginate(10);
        $organizations = Organization::orderBy("id", "DESC")->get();

        return apiResponse($organizations, 'Organizations fetched successfully');
        // return response(compact('organizations'));
    }

    public function store(StoreOrganizationRequest $request)
    {
        $data = $request->validated();
        $organization = Organization::create($data);

        if (!$organization) {
            return apiResponse(null, 'Organization creation failed', false, 404);
        }
        return apiResponse(new OrganizationResource($organization), 'Organization created successfully', true, 201);
        // return response(new OrganizationResource($organization), 201);
    }

    public function show(Organization $organization)
    {
        $organizationDetails = DB::table('organizations')->where('id', $organization->id)->first();


        if (!$organizationDetails) {
            return apiResponse(null, 'Organization not found', false, 404);
        }
        return apiResponse($organizationDetails, 'Organization details fetched successfully');
        // return response()->json(['data' => $organizationDetails]);
    }

    public function update(UpdateOrganizationRequest $request, Organization $organization)
    {
        $data = $request->validated();
        // $organization->update($data);
        if (!$organization->update($data)) {
            return apiResponse(null, 'Failed to update organization.', false, 500);
        }

        return apiResponse(new OrganizationResource($organization), 'Organization updated successfully');
        // return new OrganizationResource($organization);
    }

    public function destroy(Organization $organization)
    {
        // Check if the organization has existing data
        $hasTasks = DB::table('tasks')->where('organization_id', $organization->id)->exists();
        if ($hasTasks) {
            return apiResponse(null, 'Organization cannot be deleted because it has existing data.', false, 400);
        }
        if (!$organization->delete()) {
            return apiResponse(null, 'Failed to delete organization.', false, 500);
        }
        // Fetch the updated organizations again
        $organizations = Organization::orderBy("id", "DESC")->get();

        return apiResponse(OrganizationResource::collection($organizations), 'Organization deleted successfully');
        // return response(OrganizationResource::collection($organizations), 200);
    }
}
