<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\DB;

class KanbanColumn extends Model
{
    use HasFactory;

    protected $fillable = [
        'project_id',
        'task_status_id',
        'position'
    ];

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
        $originalPosition = $kanbanColumn->position;
        // Find the current column
        DB::transaction(function () use ($kanbanColumn, $newPosition, $originalPosition, $organization_id) {
            // Find the column that currently has the target position
            $other = self::where('organization_id', $organization_id)
                ->where('project_id', $kanbanColumn->project_id)
                ->where('position', $newPosition)
                ->lockForUpdate() // prevents race condition
                ->firstOrFail();
            // Use a temp position outside possible range to avoid unique violation
            $temp = -1 * time(); // just a unique negative value
            // Step 1: Move $other to temp
            $other->update(['position' => $temp]);

            // Step 2: Move $column to new position
            $kanbanColumn->update(['position' => $newPosition]);

            // Step 3: Move $other to old position
            $other->update(['position' => $originalPosition]);
        });
    }
}
