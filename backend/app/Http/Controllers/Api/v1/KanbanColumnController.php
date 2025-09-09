<?php

namespace App\Http\Controllers\Api\v1;

use App\Http\Controllers\Controller;
use App\Models\KanbanColumn;
use App\Http\Requests\StoreKanbanColumnRequest;
use App\Http\Requests\UpdateKanbanColumnRequest;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;

// TODO: Kanban CRUD on project and status add & delete. Update kanban columns is the only function needed here
class KanbanColumnController extends Controller
{

    protected KanbanColumn $kanbanColumn;
    protected $userData;
    public function __construct(KanbanColumn $kanbanColumn)
    {
        $this->kanbanColumn = $kanbanColumn;
        $this->userData = Auth::user();
    }
    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateKanbanColumnRequest $request, KanbanColumn $kanbanColumn)
    {
        $validated = $request->validated();

        $this->kanbanColumn->updatePosition($validated, $kanbanColumn, $this->userData->organization_id);
        $updated = $this->kanbanColumn->where('organization_id', $this->userData->organization_id)->where('project_id', $kanbanColumn->project_id)->orderBy("position", "ASC")->get();
        return apiResponse(
            $updated,
            'Kanban column updated successfully.'
        );
    }
}
