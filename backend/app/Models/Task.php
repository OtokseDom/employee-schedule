<?php

namespace App\Models;

use App\Http\Resources\TaskHistoryResource;
use App\Http\Resources\TaskResource;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

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

    public function storeTask($request, $userData)
    {
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

    public function updateTask($request, $task, $userData)
    {
        $original = $task->getOriginal();
        $validated = $request->validated();
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
                // } else if (in_array($key, ['assignee_id'])) {
                //     // save assignee name instead of id in task history
                //     $user = new User();
                //     $orig = isset($original[$key]) ? optional($user->find($original[$key]))->name : null;
                //     $val = $value ? optional($user->find($value))->name : null;

                //     if ($orig !== $val) {
                //         $changes[$key] = [
                //             'from' => $orig,
                //             'to' => $val,
                //         ];
                //     }
            } else if ($key === 'assignees') {
                // current assigned users
                $origUsers = $task->assignees()->pluck('name')->toArray(); // before update
                $valUsers = User::whereIn('id', $value)->pluck('name')->toArray(); // new assignment from request

                // compare
                if (array_diff($origUsers, $valUsers) || array_diff($valUsers, $origUsers)) {
                    $changes['assignees'] = [
                        'from' => implode(', ', $origUsers),
                        'to'   => implode(', ', $valUsers),
                    ];
                }
            } else if (in_array($key, ['parent_id'])) {
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
}
