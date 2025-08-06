<?php

namespace App\Http\Controllers\Api\v1;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreProjectRequest;
use App\Http\Requests\UpdateProjectRequest;
use App\Http\Resources\ProjectResource;
use App\Models\Project;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class ProjectController extends Controller
{
    protected Project $project;
    protected $userData;
    public function __construct(Project $project)
    {
        $this->project = $project;
        $this->userData = Auth::user();
    }
    public function index()
    {
        $projects = $this->project->getProjects($this->userData->organization_id);
        return apiResponse($projects, 'Projects fetched successfully');
    }

    // public function store(StoreProjectRequest $request)
    // {
    //     $project = $this->project->storeProject($request);
    //     if (!$project) {
    //         return apiResponse(null, 'Project creation failed', false, 404);
    //     }
    //     return apiResponse(new ProjectResource($project), 'Project created successfully', true, 201);
    // }

    // public function show(Project $project)
    // {
    //     $details = $this->project->showProject($this->userData->organization_id, $project->id);
    //     if (!$details) {
    //         return apiResponse(null, 'Project not found', false, 404);
    //     }
    //     return apiResponse(new ProjectResource($details), 'Project details fetched successfully');
    // }

    // public function update(UpdateProjectRequest $request, Project $project)
    // {
    //     $updated = $this->project->updateProject($request, $project);
    //     if (!$updated) {
    //         return apiResponse(null, 'Failed to update project.', false, 500);
    //     }
    //     return apiResponse(new ProjectResource($updated), 'Project updated successfully');
    // }

    // public function destroy(Project $project)
    // {
    //     $result = $this->project->deleteProject($project, $this->userData->organization_id);
    //     if ($result === false) {
    //         return apiResponse(null, 'Project cannot be deleted because they have assigned tasks.', false, 400);
    //     }
    //     if ($result === null) {
    //         return apiResponse(null, 'Failed to delete project.', false, 500);
    //     }
    //     return apiResponse(ProjectResource::collection($result), 'Project deleted successfully');
    // }
}
