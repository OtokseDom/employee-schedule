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
        return $this->create($request->validated());
    }

    public function showOrganization($organization)
    {
        return $this->find($organization->id);
    }

    public function deleteOrganization($organization)
    {
        $hasTasks = Task::where('organization_id', $organization->id)->exists();
        if ($hasTasks) return false;

        if ($organization->delete()) {
            return $this->orderBy("id", "DESC")->get();
        }
        return null;
    }

    public function generateCode($organization, $userData)
    {
        if ($organization->id !== $userData->organization_id) {
            return "not found";
        }
        $organization->code = strtoupper(uniqid('DOM'));
        return $organization->save() ? $organization : null;
    }
}
