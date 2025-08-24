<?php

namespace App\Http\Controllers\Api\v1;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreOrganizationRequest;
use App\Http\Requests\UpdateOrganizationRequest;
use App\Http\Resources\OrganizationResource;
use App\Models\Organization;

class OrganizationController extends Controller
{
    protected Organization $organization;
    public function __construct(Organization $organization)
    {
        $this->organization = $organization;
    }

    public function index()
    {
        $organizations = $this->organization->getOrganizations();
        return apiResponse($organizations, 'Organizations fetched successfully');
    }

    public function store(StoreOrganizationRequest $request)
    {
        $organization = $this->organization->storeOrganization($request);
        if (!$organization) {
            return apiResponse(null, 'Organization creation failed', false, 500);
        }
        return apiResponse(new OrganizationResource($organization), 'Organization created successfully', true, 201);
    }

    public function show(Organization $organization)
    {
        $details = $this->organization->showOrganization($organization);
        if (!$details) {
            return apiResponse(null, 'Organization not found', false, 404);
        }
        return apiResponse(new OrganizationResource($details), 'Organization details fetched successfully');
    }

    public function update(UpdateOrganizationRequest $request, Organization $organization)
    {
        $updated = $organization->update($request->validated());
        if (!$updated) {
            return apiResponse(null, 'Failed to update organization.', false, 500);
        }
        return apiResponse(new OrganizationResource($organization), 'Organization updated successfully');
    }

    public function destroy(Organization $organization)
    {
        $result = $this->organization->deleteOrganization($organization);
        if ($result === false) {
            return apiResponse(null, 'Organization cannot be deleted because it has existing data.', false, 400);
        }
        if ($result === null) {
            return apiResponse(null, 'Failed to delete organization.', false, 500);
        }
        return apiResponse(OrganizationResource::collection($result), 'Organization deleted successfully');
    }

    public function generateCode(Organization $organization)
    {
        $updated = $this->organization->generateCode($organization);
        if (!$updated) {
            return apiResponse(null, 'Failed to update organization code.', false, 500);
        }
        return apiResponse(new OrganizationResource($updated), 'New organization code generated successfully');
    }
}
