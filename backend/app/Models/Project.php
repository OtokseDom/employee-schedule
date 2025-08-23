<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Project extends Model
{
    use HasFactory;

    protected $fillable = [
        'organization_id',
        'status_id',
        'title',
        'description',
        'target_date',
        'estimated_date',
        'priority',
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

    // Relationship with Status
    public function status()
    {
        return $this->belongsTo(TaskStatus::class);
    }

    /* -------------------------------------------------------------------------- */
    /*                          Controller Logic Function                         */
    /* -------------------------------------------------------------------------- */
    public function getProjects($organization_id)
    {
        return $this->with('status:id,name,color')
            ->orderBy("id", "DESC")
            ->where('organization_id', $organization_id)
            ->get();
    }

    public function storeProject($request)
    {
        return $this->create($request->validated());
    }

    public function showProject($organization_id, $project_id)
    {
        return $this->with('status:id,name,color')->where('id', $project_id)
            ->where('organization_id', $organization_id)
            ->first();
    }

    public function updateProject($request, $project)
    {
        $project->update($request->validated());
        return $project;
    }

    public function deleteProject($project)
    {
        if (Task::where('project_id', $project->id)->exists()) {
            return false;
        }
        if (!$project->delete()) {
            return null;
        }
        return true;
    }
}