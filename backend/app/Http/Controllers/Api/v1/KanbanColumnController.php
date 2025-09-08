<?php

namespace App\Http\Controllers\Api\v1;

use App\Http\Controllers\Controller;
use App\Models\KanbanColumn;
use App\Http\Requests\StoreKanbanColumnRequest;
use App\Http\Requests\UpdateKanbanColumnRequest;
// TODO: Kanban CRUD on project and status add & delete. Update kanban columns is the only function needed here
class KanbanColumnController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreKanbanColumnRequest $request)
    {
        //
    }

    /**
     * Display the specified resource.
     */
    public function show(KanbanColumn $kanbanColumn)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateKanbanColumnRequest $request, KanbanColumn $kanbanColumn)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(KanbanColumn $kanbanColumn)
    {
        //
    }
}
