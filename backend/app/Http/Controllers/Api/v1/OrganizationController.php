<?php

namespace App\Http\Controllers\Api\v1;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreOrganizationRequest;
use App\Http\Requests\UpdateOrganizationRequest;
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
        return apiResponse($organization, 'Organization created successfully', true, 201);
    }

    public function show(Organization $organization)
    {
        $details = $this->organization->showOrganization($organization);
        return apiResponse($details, 'Organization details fetched successfully');
    }

    public function update(UpdateOrganizationRequest $request, Organization $organization)
    {
        $details = $this->organization->updateOrganization($request, $organization);
        return apiResponse($details, 'Organization updated successfully');
    }

    public function destroy(Organization $organization)
    {
        $organizations = $this->organization->deleteOrganization($organization);
        return apiResponse($organizations, 'Organization deleted successfully');
    }

    public function generateCode(Organization $organization)
    {
        $details = $this->organization->generateCode($organization);
        return apiResponse($details, 'New organization code generated successfully');
    }
}
