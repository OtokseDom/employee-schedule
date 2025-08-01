<?php

namespace App\Models;

use App\Http\Resources\OrganizationResource;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Organization extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'description',
        'code',
    ];

    public function users()
    {
        return $this->hasMany(User::class);
    }

    public function tasks()
    {
        return $this->hasMany(Task::class);
    }

    public function taskHistories()
    {
        return $this->hasMany(TaskHistory::class);
    }

    public function categories()
    {
        return $this->hasMany(Category::class);
    }

    /* -------------------------------------------------------------------------- */
    /*                          Controller Logic Function                         */
    /* -------------------------------------------------------------------------- */
    public function getOrganizations()
    {
        return $this->orderBy("id", "DESC")->get();
    }

    public function storeOrganization($request)
    {
        $organization = $this->create($request->validated());
        if (!$organization) {
            return apiResponse(null, 'Organization creation failed', false, 404);
        }
        return new OrganizationResource($organization);
    }

    public function showOrganization($organization)
    {
        $details = $this->where('id', $organization->id)->first();
        if (!$details) {
            return apiResponse(null, 'Organization not found', false, 404);
        }
        return $details;
    }

    public function updateOrganization($request, $organization)
    {
        if (!$organization->update($request->validated())) {
            return apiResponse(null, 'Failed to update organization.', false, 500);
        }
        return new OrganizationResource($organization);
    }

    public function deleteOrganization($organization)
    {
        // Check if the organization has existing data
        $hasTasks = Task::where('organization_id', $organization->id)->exists();
        if ($hasTasks) {
            return apiResponse(null, 'Organization cannot be deleted because it has existing data.', false, 400);
        }
        if (!$organization->delete()) {
            return apiResponse(null, 'Failed to delete organization.', false, 500);
        }
        $organizations = $this->orderBy("id", "DESC")->get();
        return OrganizationResource::collection($organizations);
    }

    public function generateCode($organization)
    {
        $newCode = strtoupper(uniqid('DOM')); // Example: DOM-64CF46D5A1234
        $organization->code = $newCode;
        if (!$organization->save()) {
            return apiResponse(null, 'Failed to update organization code.', false, 500);
        }
        return new OrganizationResource($organization);
    }
}
