<?php

namespace App\Models;

use App\Http\Resources\TaskHistoryResource;
use App\Http\Resources\TaskResource;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\DB;

class Task extends Model
{
    use HasFactory;

    protected $fillable = [
        'organization_id',
        'status_id',
        'project_id',
        'category_id',
        'parent_id',
        'title',
        'description',
        'expected_output',
        // 'assignee_id',
        'start_date',
        'end_date',
        'start_time',
        'end_time',
        'time_estimate',
        'time_taken',
        'delay',
        'delay_reason',
        'performance_rating',
        'remarks',
        'position',
    ];

    protected $casts = [
        'start_date' => 'date',
        'end_date' => 'date',
    ];

    // Relationship with User (Assignee)
    public function assignee()
    {
        return $this->belongsTo(User::class);
    }

    // Relationship with Multiple Users (Assignees)
    public function assignees()
    {
        return $this->belongsToMany(User::class, 'task_assignees', 'task_id', 'assignee_id')
            ->withTimestamps();
    }

    // Relationship with Project
    public function project()
    {
        return $this->belongsTo(Project::class);
    }

    // A task may have a parent
    public function parent()
    {
        return $this->belongsTo(Task::class, 'parent_id');
    }

    // A task may have many children
    public function children()
    {
        return $this->hasMany(Task::class, 'parent_id');
    }

    // Relationship with TaskHistory
    public function taskHistories()
    {
        return $this->hasMany(TaskHistory::class, 'task_id');
    }

    // Relationship with Category
    public function category()
    {
        return $this->belongsTo(Category::class);
    }

    // Relationship with Status
    public function status()
    {
        return $this->belongsTo(TaskStatus::class);
    }

    /* -------------------------------------------------------------------------- */
    /*                          Contrller Logic Functions                         */
    /* -------------------------------------------------------------------------- */
    public function getTasks($organization_id)
    {
        // $tasks = $this->with('assignees:id,name,email,role,position')->find([54]);
        // dd($tasks->first()->assignees);
        return TaskResource::collection($this->with([
            'status:id,name,color',
            // 'assignee:id,name,email,role,position',
            'assignees:id,name,email,role,position',
            'category',
            'project:id,title',
            'parent:id,title',
            'children' => function ($query) {
                $query->select('id', 'status_id', 'parent_id', 'title', 'description', 'project_id', 'category_id', 'start_date', 'end_date', 'start_time', 'end_time', 'time_estimate', 'time_taken', 'delay', 'delay_reason', 'performance_rating', 'remarks')
                    ->with([
                        'status:id,name,color',
                        // 'assignee:id,name,email,role,position',
                        'assignees:id,name,email,role,position',
                        'project:id,title',
                        'category'
                    ]);
            },
        ])
            ->where('organization_id', $organization_id)
            ->orderBy('id', 'DESC')->get());
    }

    // Add task should add correct position
    public function storeTask($request, $userData)
    {
        if ($request->organization_id !== $userData->organization_id) {
            return "not found";
        }
        $task = $this->create($request->validated());

        // attach multiple assignees if provided
        if ($request->has('assignees')) {
            $task->assignees()->attach($request->input('assignees'));
        }

        $task->load([
            'status:id,name,color',
            'assignees:id,name,email,role,position',
            // 'assignee:id,name,email',
            'category',
            'project:id,title',
            'parent:id,title',
            'children' => function ($query) {
                $query->select('id', 'status_id', 'parent_id', 'title', 'description', 'project_id', 'category_id', 'start_date', 'end_date', 'start_time', 'end_time', 'time_estimate', 'time_taken', 'delay', 'delay_reason', 'performance_rating', 'remarks')
                    ->with([
                        'status:id,name,color',
                        'assignees:id,name,email,role,position',
                        // 'assignee:id,name,email,role,position',
                        'project:id,title',
                        'category'
                    ]);
            },
        ]);

        // Record Addition in Task History
        $taskHistory = $task->taskHistories()->create([
            'organization_id' => $userData->organization_id,
            'task_id' => $task->id,
            'status_id' => $task->status_id,
            'changed_by' => $userData->id,
            'changed_at' => now(),
            'remarks' => "Task Added",
        ]);
        $data = [
            "task" => new TaskResource($task),
            "task_history" => new TaskHistoryResource($taskHistory)
        ];
        return $data;
    }

    public function showTask($id, $organization_id)
    {
        $task = $this->with([
            // 'assignee:id,name,email,role,position',
            'assignees:id,name,email,role,position',
            'status:id,name,color',
            'category',
            'project:id,title',
            'parent:id,title',
            'children' => function ($query) {
                $query->select('id', 'status_id', 'parent_id', 'title', 'description', 'project_id', 'category_id', 'start_date', 'end_date', 'start_time', 'end_time', 'time_estimate', 'time_taken', 'delay', 'delay_reason', 'performance_rating', 'remarks')
                    ->with([
                        'status:id,name,color',
                        'assignees:id,name,email,role,position',
                        // 'assignee:id,name,email,role,position',
                        'project:id,title',
                        'category'
                    ]);
            },
        ])
            ->where('id', $id)
            ->where('organization_id', $organization_id)
            ->first();
        if (!$task || $task->organization_id !== $organization_id)
            return null;
        return new TaskResource($task);
    }

    // TODO: Make adding task history entry as global funtion - use in kanbanColumn model when updating task
    // TODO: updating task status or project should update position correctly in origin status and destination status.
    public function updateTask($request, $task, $userData)
    {
        if ($task->organization_id !== $userData->organization_id || $request->organization_id !== $userData->organization_id) {
            return null;
        }
        $original = $task->getOriginal();
        $validated = $request->validated();

        // Get original assigned user IDs before update
        $origUserIds = $task->assignees()->pluck('users.id')->toArray();

        $task->update($validated);

        // sync new assignees (if provided)
        if ($request->has('assignees')) {
            $task->assignees()->sync($request->input('assignees'));
        }

        $task->load([
            // 'assignee:id,name,email,role,position',
            'assignees:id,name,email,role,position',
            'status:id,name,color',
            'category',
            'project:id,title',
            'parent:id,title',
            'children' => function ($query) {
                $query->select('id', 'status_id', 'parent_id', 'title', 'description', 'project_id', 'category_id', 'start_date', 'end_date', 'start_time', 'end_time', 'time_estimate', 'time_taken', 'delay', 'delay_reason', 'performance_rating', 'remarks')
                    ->with([
                        'status:id,name,color',
                        'assignees:id,name,email,role,position',
                        // 'assignee:id,name,email,role,position',
                        'project:id,title',
                        'category'
                    ]);
            },
        ]);

        // Build changes as a JSON object for task history
        $changes = [];
        foreach ($validated as $key => $value) {
            // Normalize date values for comparison
            if (in_array($key, ['start_date', 'end_date'])) {
                $orig = isset($original[$key]) ? date('Y-m-d', strtotime($original[$key])) : null;
                $val = $value ? date('Y-m-d', strtotime($value)) : null;
                if ($orig !== $val) {
                    $changes[$key] = [
                        'from' => $orig,
                        'to' => $value,
                    ];
                }
            } else if (in_array($key, ['status_id'])) {
                // save project name instead of id in task history
                $status = new TaskStatus();
                $orig = isset($original[$key]) ? optional($status->find($original[$key]))->name : null;
                $val = $value ? optional($status->find($value))->name : null;

                if ($orig !== $val) {
                    $changes[$key] = [
                        'from' => $orig,
                        'to' => $val,
                    ];
                }
            } else if (in_array($key, ['project_id'])) {
                // save project name instead of id in task history
                $project = new Project();
                $orig = isset($original[$key]) ? optional($project->find($original[$key]))->title : null;
                $val = $value ? optional($project->find($value))->title : null;

                if ($orig !== $val) {
                    $changes[$key] = [
                        'from' => $orig,
                        'to' => $val,
                    ];
                }
            } else if (in_array($key, ['category_id'])) {
                // save category name instead of id in task history
                $category = new Category();
                $orig = isset($original[$key]) ? optional($category->find($original[$key]))->name : null;
                $val = $value ? optional($category->find($value))->name : null;

                if ($orig !== $val) {
                    $changes[$key] = [
                        'from' => $orig,
                        'to' => $val,
                    ];
                }
            } else if ($key === 'assignees') {
                // Get new assigned user IDs from request
                $valUserIds = is_array($value) ? $value : [];
                // Compare arrays
                if (array_diff($origUserIds, $valUserIds) || array_diff($valUserIds, $origUserIds)) {
                    // Get user names for display
                    $origUsers = User::whereIn('id', $origUserIds)->pluck('name')->toArray();
                    $valUsers = User::whereIn('id', $valUserIds)->pluck('name')->toArray();
                    $changes[$key] = [
                        'from' => implode(', ', $origUsers),
                        'to'   => implode(', ', $valUsers),
                    ];
                }
            } else if ($key === 'parent_id') {
                // save parent title instead of id in task history
                $orig = isset($original[$key]) ? optional($this->find($original[$key]))->title : null;
                $val = $value ? optional($this->find($value))->title : null;

                if ($orig !== $val) {
                    $changes[$key] = [
                        'from' => $orig,
                        'to' => $val,
                    ];
                }
            } else {
                if (array_key_exists($key, $original) && $original[$key] != $value) {
                    $changes[$key] = [
                        'from' => $original[$key],
                        'to' => $value,
                    ];
                }
            }
        }
        $history = null;
        // Record changes in Task History if there are any
        if (!empty($changes)) {
            // Record Update in Task History
            $history = $task->taskHistories()->create([
                'organization_id' => $userData->organization_id,
                'task_id' => $task->id,
                'status_id' => $task->status_id,
                'changed_by' => $userData->id,
                'changed_at' => now(),
                'remarks' => $changes ? json_encode($changes) : null,
            ]);
        }
        $data = [
            "task" => new TaskResource($task),
            "task_history" => $history ? new TaskHistoryResource($history) : null
        ];
        return $data;
    }

    // TODO: Removing task should update succeeding tasks position
    public function deleteSubtasks($task)
    {
        // Get all child task IDs
        $childIds = $this->where('parent_id', $task->id)->pluck('id')->toArray();
        // Delete all child tasks
        return $this->whereIn('id', $childIds)->delete();
    }

    public function updateTaskPosition(Task $task, int $newStatusId, int $newPosition, int $organizationId)
    {
        $oldStatusId = $task->status_id;
        $oldPosition = $task->position;
        $projectId = $task->project_id;

        // If nothing changes, return early
        if ($oldStatusId === $newStatusId && $oldPosition === $newPosition) return collect([$task]);

        return DB::transaction(function () use ($task, $oldStatusId, $oldPosition, $newStatusId, $newPosition, $projectId, $organizationId) {

            $affectedTasks = collect();

            // Step 0: temporarily move the dragged task out of the range
            $task->update(['position' => -1000000]);

            // --- SAME COLUMN MOVE ---
            if ($oldStatusId === $newStatusId) {
                if ($newPosition < $oldPosition) {
                    // Moving up
                    $affected = self::where('organization_id', $organizationId)
                        ->where('project_id', $projectId)
                        ->where('status_id', $oldStatusId)
                        ->whereBetween('position', [$newPosition, $oldPosition - 1])
                        ->orderBy('position', 'ASC')
                        ->get();

                    // Temporarily move affected tasks out of range
                    foreach ($affected as $t) {
                        $t->update(['position' => $t->position + 1000000]);
                    }

                    // Place dragged task in its new position
                    $task->update(['position' => $newPosition]);

                    // Bring affected tasks back, preserving order
                    foreach ($affected as $i => $t) {
                        $t->update(['position' => $newPosition + 1 + $i]);
                    }

                    $affectedTasks = $affected->push($task);
                } else {
                    // Moving down
                    $affected = self::where('organization_id', $organizationId)
                        ->where('project_id', $projectId)
                        ->where('status_id', $oldStatusId)
                        ->whereBetween('position', [$oldPosition + 1, $newPosition])
                        ->orderBy('position', 'DESC')
                        ->get();

                    foreach ($affected as $t) {
                        $t->update(['position' => $t->position - 1000000]);
                    }

                    $task->update(['position' => $newPosition]);

                    foreach ($affected as $i => $t) {
                        $t->update(['position' => $newPosition - 1 - $i]);
                    }

                    $affectedTasks = $affected->push($task);
                }
            }

            // --- CROSS COLUMN MOVE ---
            else {
                // Shift tasks in new column at or after new position
                $newColumnAffected = self::where('organization_id', $organizationId)
                    ->where('project_id', $projectId)
                    ->where('status_id', $newStatusId)
                    ->where('position', '>=', $newPosition)
                    ->orderBy('position', 'ASC')
                    ->get();

                foreach ($newColumnAffected as $t) {
                    $t->update(['position' => $t->position + 1000000]);
                }

                // Place dragged task in new column/position
                $task->update([
                    'status_id' => $newStatusId,
                    'position' => $newPosition,
                ]);

                foreach ($newColumnAffected as $i => $t) {
                    $t->update(['position' => $newPosition + 1 + $i]);
                }

                // Shift tasks in old column after old position
                $oldColumnAffected = self::where('organization_id', $organizationId)
                    ->where('project_id', $projectId)
                    ->where('status_id', $oldStatusId)
                    ->where('position', '>', $oldPosition)
                    ->orderBy('position', 'ASC')
                    ->get();

                foreach ($oldColumnAffected as $i => $t) {
                    $t->update(['position' => $oldPosition + $i]);
                }

                $affectedTasks = $newColumnAffected->push($task)->merge($oldColumnAffected);
            }

            // return TaskResource::collection($affectedTasks->sortBy('position')->values());
            return TaskResource::collection($this->with([
                'status:id,name,color',
                // 'assignee:id,name,email,role,position',
                'assignees:id,name,email,role,position',
                'category',
                'project:id,title',
                'parent:id,title',
                'children' => function ($query) {
                    $query->select('id', 'status_id', 'parent_id', 'title', 'description', 'project_id', 'category_id', 'start_date', 'end_date', 'start_time', 'end_time', 'time_estimate', 'time_taken', 'delay', 'delay_reason', 'performance_rating', 'remarks')
                        ->with([
                            'status:id,name,color',
                            // 'assignee:id,name,email,role,position',
                            'assignees:id,name,email,role,position',
                            'project:id,title',
                            'category'
                        ]);
                },
            ])
                ->where('organization_id', $organizationId)
                ->orderBy('id', 'DESC')->get());
        });
    }
}
