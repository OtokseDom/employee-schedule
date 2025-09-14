<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\DB;

class KanbanColumn extends Model
{
    use HasFactory;

    protected $fillable = [
        'organization_id',
        'project_id',
        'task_status_id',
        'position'
    ];


    // Relationship with Organization
    public function organization()
    {
        return $this->belongsTo(Organization::class);
    }

    // Relationship with Project
    public function project()
    {
        return $this->belongsTo(Project::class);
    }
    // Relationship with Task Statuses
    public function status()
    {
        return $this->belongsTo(TaskStatus::class);
    }

    /* -------------------------------------------------------------------------- */
    /*                          Controller Logic Function                         */
    /* -------------------------------------------------------------------------- */
    public function updatePosition($validated, $kanbanColumn, $organization_id)
    {
        $newPosition = $validated['position'];
        $oldPosition = $kanbanColumn->position;
        if ($newPosition === $oldPosition) return;

        DB::transaction(function () use ($kanbanColumn, $newPosition, $oldPosition, $organization_id) {

            $projectId = $kanbanColumn->project_id;

            // Step 0: move dragged column out of range
            $kanbanColumn->update(['position' => -1000000]);

            if ($newPosition < $oldPosition) {
                // Moving up
                $affected = self::where('organization_id', $organization_id)
                    ->where('project_id', $projectId)
                    ->whereBetween('position', [$newPosition, $oldPosition - 1])
                    ->orderBy('position', 'ASC')
                    ->get();

                // Temporarily move affected columns out of range
                foreach ($affected as $col) {
                    $col->update(['position' => $col->position + 1000000]);
                }

                // Place dragged column in its new position
                $kanbanColumn->update(['position' => $newPosition]);

                // Bring affected columns back, preserving order
                foreach ($affected as $i => $col) {
                    $col->update(['position' => $newPosition + 1 + $i]);
                }
            } elseif ($newPosition > $oldPosition) {
                // Moving down
                $affected = self::where('organization_id', $organization_id)
                    ->where('project_id', $projectId)
                    ->whereBetween('position', [$oldPosition + 1, $newPosition])
                    ->orderBy('position', 'DESC')
                    ->get();

                // Temporarily move affected columns out of range
                foreach ($affected as $col) {
                    $col->update(['position' => $col->position - 1000000]);
                }

                // Place dragged column in its new position
                $kanbanColumn->update(['position' => $newPosition]);

                // Bring affected columns back, preserving order
                foreach ($affected as $i => $col) {
                    $col->update(['position' => $newPosition - 1 - $i]);
                }
            }
        });
    }
}
