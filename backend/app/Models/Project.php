<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Project extends Model
{
    use HasFactory;

    protected $fillable = [
        'organization_id',
        'title',
        'description',
        'target_date',
        'estimated_date',
        'priority',
        'status',
        'remarks'
    ];

    protected $casts = [
        'start_date' => 'date',
        'end_date' => 'date',
    ];

    // Relationship with Organization
    public function organization()
    {
        return $this->belongsTo(Organization::class);
    }

    // Relationship with Task
    public function tasks()
    {
        return $this->hasMany(Task::class, 'project_id');
    }

    /* -------------------------------------------------------------------------- */
    /*                          Controller Logic Function                         */
    /* -------------------------------------------------------------------------- */
    public function getProjects($organization_id)
    {
        return $this->orderBy("id", "DESC")->where('organization_id', $organization_id)->get();
    }

    public function storeProject($request)
    {
        return $this->create($request->validated());
    }

    public function showProject($organization_id, $project_id)
    {
        return $this->where('id', $project_id)
            ->where('organization_id', $organization_id)
            ->first();
    }

    public function updateProject($request, $project)
    {
        $project->update($request->validated());
        return $project;
    }

    public function deleteProject($project, $organization_id)
    {
        if (Task::where('project_id', $project->id)->exists()) {
            return false;
        }
        if (!$project->delete()) {
            return null;
        }
        return $this->where('organization_id', $organization_id)->orderBy("id", "DESC")->get();
    }
}
