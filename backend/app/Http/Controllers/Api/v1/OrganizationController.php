<?php

namespace App\Http\Controllers\Api\v1;

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
    }

    public function store(StoreOrganizationRequest $request)
    {
        $data = $request->validated();
        $organization = Organization::create($data);

        if (!$organization) {
            return apiResponse(null, 'Organization creation failed', false, 404);
        }
        return apiResponse(new OrganizationResource($organization), 'Organization created successfully', true, 201);
    }

    public function show(Organization $organization)
    {
        $organizationDetails = DB::table('organizations')->where('id', $organization->id)->first();


        if (!$organizationDetails) {
            return apiResponse(null, 'Organization not found', false, 404);
        }
        return apiResponse($organizationDetails, 'Organization details fetched successfully');
    }

    public function update(UpdateOrganizationRequest $request, Organization $organization)
    {
        $data = $request->validated();
        // $organization->update($data);
        if (!$organization->update($data)) {
            return apiResponse(null, 'Failed to update organization.', false, 500);
        }

        return apiResponse(new OrganizationResource($organization), 'Organization updated successfully');
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
    }


    public function generateCode(Organization $organization)
    {
        $newCode = strtoupper(uniqid('DOM')); // Example: DOM-64CF46D5A1234

        $organization->code = $newCode;

        if (!$organization->save()) {
            return apiResponse(null, 'Failed to update organization code.', false, 500);
        }

        return apiResponse(new OrganizationResource($organization), 'New organization code generated successfully');
    }
}
