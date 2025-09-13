<?php

namespace App\Models;

use App\Http\Resources\TaskHistoryResource;
use App\Http\Resources\TaskResource;
use App\Services\TaskHistoryService;
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
                $query->select('*')
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
                $query->select('*')
                    ->with([
                        'status:id,name,color',
                        'assignees:id,name,email,role,position',
                        // 'assignee:id,name,email,role,position',
                        'project:id,title',
                        'category'
                    ]);
            },
        ]);

        // Use TaskHistoryService 
        $historyService = app(TaskHistoryService::class);
        $taskHistory = $historyService->record(
            $task,
            "Task Added", // passing a simple change set
            $userData->id,
            $userData->organization_id
        );

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
                $query->select('*')
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

    public function updateTask($request, $task, $userData)
    {
        if ($task->organization_id !== $userData->organization_id || $request->organization_id !== $userData->organization_id) {
            return null;
        }

        $original = $task->getOriginal();
        $validated = $request->validated();

        $origUserIds = $task->assignees()->pluck('users.id')->toArray();

        // Detect if project/status column changed
        $originalProject = $original['project_id'];
        $originalStatus  = $original['status_id'];

        $newProject = $validated['project_id'] ?? $task->project_id;
        $newStatus  = $validated['status_id'] ?? $task->status_id;

        $columnChanged = $originalProject != $newProject || $originalStatus != $newStatus;

        DB::transaction(function () use ($task, $validated, $origUserIds, $userData, $columnChanged, $original) {

            if ($columnChanged) {
                // Temporarily move the task to a position that won't conflict
                $task->update(['position' => -1 * time()]);

                // Shift old column tasks down
                Task::where('project_id', $original['project_id'])
                    ->where('status_id', $original['status_id'])
                    ->where('position', '>', $original['position'])
                    ->orderBy('position')  // can be asc or desc, but asc is fine
                    ->each(function ($t) {
                        $t->decrement('position');
                    });
            }

            // Finally update task to its new project/status/position
            $task->update($validated);

            // Sync assignees if provided
            if (isset($validated['assignees'])) {
                $task->assignees()->sync($validated['assignees']);
            }

            // Build task history changes
            $changes = [];
            foreach ($validated as $key => $value) {
                switch ($key) {
                    case 'start_date':
                    case 'end_date':
                        $orig = isset($original[$key]) ? date('Y-m-d', strtotime($original[$key])) : null;
                        $val = $value ? date('Y-m-d', strtotime($value)) : null;
                        if ($orig !== $val) $changes[$key] = ['from' => $orig, 'to' => $val];
                        break;
                    case 'status_id':
                        $orig = optional(TaskStatus::find($original[$key] ?? null))->name;
                        $val  = optional(TaskStatus::find($value))->name;
                        if ($orig !== $val) $changes[$key] = ['from' => $orig, 'to' => $val];
                        break;
                    case 'project_id':
                        $orig = optional(Project::find($original[$key] ?? null))->title;
                        $val  = optional(Project::find($value))->title;
                        if ($orig !== $val) $changes[$key] = ['from' => $orig, 'to' => $val];
                        break;
                    case 'category_id':
                        $orig = optional(Category::find($original[$key] ?? null))->name;
                        $val  = optional(Category::find($value))->name;
                        if ($orig !== $val) $changes[$key] = ['from' => $orig, 'to' => $val];
                        break;
                    case 'assignees':
                        $valUserIds = is_array($value) ? $value : [];
                        if (array_diff($origUserIds, $valUserIds) || array_diff($valUserIds, $origUserIds)) {
                            $origUsers = User::whereIn('id', $origUserIds)->pluck('name')->toArray();
                            $valUsers  = User::whereIn('id', $valUserIds)->pluck('name')->toArray();
                            $changes[$key] = ['from' => implode(', ', $origUsers), 'to' => implode(', ', $valUsers)];
                        }
                        break;
                    case 'parent_id':
                        $orig = isset($original[$key]) ? optional($this->find($original[$key]))->title : null;
                        $val  = $value ? optional($this->find($value))->title : null;
                        if ($orig !== $val) $changes[$key] = ['from' => $orig, 'to' => $val];
                        break;
                    case 'position':
                        // Ignore position changes completely
                        break;
                    default:
                        if (array_key_exists($key, $original) && $original[$key] != $value) {
                            $changes[$key] = ['from' => $original[$key], 'to' => $value];
                        }
                        break;
                }
            }

            // Record task history
            $historyService = app(TaskHistoryService::class);
            $historyService->record($task, $changes, $userData->id, $userData->organization_id);
        });

        // Reload relationships for response
        $task->load([
            'assignees:id,name,email,role,position',
            'status:id,name,color',
            'category',
            'project:id,title',
            'parent:id,title',
            'children' => function ($query) {
                $query->select('*')->with([
                    'status:id,name,color',
                    'assignees:id,name,email,role,position',
                    'project:id,title',
                    'category'
                ]);
            },
        ]);

        return [
            'task' => new TaskResource($task),
            'task_history' => null // history can be loaded if needed
        ];
    }

    // Deletes this task and optionally its subtasks, shifts positions properly
    public function deleteWithSubtasks(bool $deleteSubtasks = false)
    {
        $organizationId = $this->organization_id;

        return DB::transaction(function () use ($deleteSubtasks, $organizationId) {

            // 1️⃣ Collect subtasks if requested
            $childTasks = $deleteSubtasks
                ? self::where('parent_id', $this->id)->get()
                : collect();

            // 2️⃣ Include the main task
            $allTasks = $childTasks->concat([$this]);

            // 3️⃣ Group tasks by project + status for shifting
            $groups = [];
            foreach ($allTasks as $t) {
                $groups[$t->project_id][$t->status_id][] = $t->position;
            }

            // 4️⃣ Delete all tasks in one query
            $idsToDelete = $allTasks->pluck('id')->toArray();
            self::whereIn('id', $idsToDelete)->delete();

            // 5️⃣ Shift remaining tasks per column
            foreach ($groups as $projectId => $statuses) {
                foreach ($statuses as $statusId => $positions) {
                    $minPosition = min($positions);
                    $countDeleted = count($positions);

                    self::where('organization_id', $organizationId)
                        ->where('project_id', $projectId)
                        ->where('status_id', $statusId)
                        ->where('position', '>', $minPosition)
                        ->update([
                            'position' => DB::raw("position - $countDeleted")
                        ]);
                }
            }

            return true;
        });
    }

    public function updateTaskPosition(Task $task, int $newStatusId, int $newPosition, int $userId, int $organization_id)
    {
        $oldStatusId = $task->status_id;
        $oldPosition = $task->position;
        $projectId = $task->project_id;

        // If nothing changes, return early
        if ($oldStatusId === $newStatusId && $oldPosition === $newPosition) return collect([$task]);

        return DB::transaction(function () use ($task, $oldStatusId, $oldPosition, $newStatusId, $newPosition, $projectId, $userId, $organization_id) {


            // Step 0: temporarily move the dragged task out of the range
            $task->update(['position' => -1000000]);

            // --- SAME COLUMN MOVE ---
            if ($oldStatusId === $newStatusId) {
                if ($newPosition < $oldPosition) {
                    // Moving up
                    $affected = self::where('organization_id', $organization_id)
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
                } else {
                    // Moving down
                    $affected = self::where('organization_id', $organization_id)
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
                }
            }

            // --- CROSS COLUMN MOVE ---
            else {
                // Shift tasks in new column at or after new position
                $newColumnAffected = self::where('organization_id', $organization_id)
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
                $oldColumnAffected = self::where('organization_id', $organization_id)
                    ->where('project_id', $projectId)
                    ->where('status_id', $oldStatusId)
                    ->where('position', '>', $oldPosition)
                    ->orderBy('position', 'ASC')
                    ->get();

                foreach ($oldColumnAffected as $i => $t) {
                    $t->update(['position' => $oldPosition + $i]);
                }

                // Record status change in task history
                // Convert status id to name
                $orig = optional(TaskStatus::find($oldStatusId ?? null))->name;
                $val  = optional(TaskStatus::find($newStatusId))->name;
                $change['status'] = ["from" => $orig, "to" => $val];
                $historyService = app(TaskHistoryService::class);
                $historyService->record($task, $change, $userId, $organization_id);
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
                    $query->select('*')
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
        });
    }
}
