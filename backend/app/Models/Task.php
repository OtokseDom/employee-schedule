<?php

namespace App\Models;

use App\Http\Resources\TaskResource;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Task extends Model
{
    use HasFactory;

    protected $fillable = [
        'organization_id',
        'project_id',
        'category_id',
        'title',
        'description',
        'expected_output',
        'assignee_id',
        'status',
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

    // Relationship with Project
    public function project()
    {
        return $this->belongsTo(Project::class);
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

    /* -------------------------------------------------------------------------- */
    /*                          Contrller Logic Functions                         */
    /* -------------------------------------------------------------------------- */
    public function getTasks($organization_id)
    {
        return TaskResource::collection($this->with(['assignee:id,name,email,role,position', 'category', 'project:id,title'])
            ->where('organization_id', $organization_id)
            ->orderBy('id', 'DESC')->get());
    }

    public function storeTask($request, $userData)
    {
        $task = $this->create($request->validated());
        $task->load(['assignee:id,name,email', 'category']);

        // Record Addition in Task History
        $task->taskHistories()->create([
            'organization_id' => $userData->organization_id,
            'task_id' => $task->id,
            'status' => $task->status,
            'changed_by' => $userData->id,
            'changed_at' => now(),
            'remarks' => "Task Added",
        ]);
        return new TaskResource($task);
    }

    public function showTask($id, $organization_id)
    {
        $task = $this->with(['assignee:id,name,email,role,position', 'category'])
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
        $task->load(['assignee:id,name,email,role,position']);

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
            } else if (in_array($key, ['assignee_id'])) {
                // save assignee name instead of id in task history
                $user = new User();
                $orig = isset($original[$key]) ? optional($user->find($original[$key]))->name : null;
                $val = $value ? optional($user->find($value))->name : null;

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
        // Record changes in Task History if there are any
        if (!empty($changes)) {
            // Record Update in Task History
            $task->taskHistories()->create([
                'organization_id' => $userData->organization_id,
                'task_id' => $task->id,
                'status' => $task->status,
                'changed_by' => $userData->id,
                'changed_at' => now(),
                'remarks' => $changes ? json_encode($changes) : null,
            ]);
        }
        return new TaskResource($task);
    }
}
