<?php

namespace App\Http\Controllers\Api\v1;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreTaskRequest;
use App\Http\Requests\UpdateTaskRequest;
use App\Models\Task;
use App\Models\TaskHistory;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;

class TaskController extends Controller
{
    protected Task $task;
    protected TaskHistory $task_history;
    protected User $user;
    protected $userData;
    public function __construct(User $user, Task $task, TaskHistory $task_history)
    {
        $this->user = $user;
        $this->task = $task;
        $this->task_history = $task_history;
        $this->userData = Auth::user();
    }

    public function index()
    {
        $tasks = $this->task->getTasks($this->userData->organization_id);
        $task_history = $this->task_history->getTaskHistories($this->userData->organization_id);
        $data = [
            'tasks' => $tasks,
            'task_history' => $task_history,
        ];
        return apiResponse($data, 'Tasks fetched successfully');
    }

    public function store(StoreTaskRequest $request)
    {
        $task = $this->task->storeTask($request, $this->userData);
        if ($task === "not found") {
            return apiResponse(null, 'Organization not found.', false, 404);
        }
        if (!$task) {
            return apiResponse(null, 'Task creation failed', false, 404);
        }
        return apiResponse($task, 'Task created successfully', true, 201);
    }

    public function show($id)
    {
        $task = $this->task->showTask($id, $this->userData->organization_id);
        if (!$task)
            apiResponse(null, 'Organization not found', false, 404);

        return apiResponse(
            $task,
            'Task details fetched successfully'
        );
    }

    public function update(UpdateTaskRequest $request, Task $task)
    {
        $updated = $this->task->updateTask($request, $task, $this->userData);
        if ($updated === null) {
            return apiResponse(null, 'Task not found.', false, 404);
        }
        if (!$updated) {
            return apiResponse(null, 'Failed to update task.', false, 500);
        }
        return apiResponse($updated, 'Task updated successfully');
    }

    public function destroy(Request $request, Task $task)
    {
        if ($task->organization_id !== $this->userData->organization_id) {
            return apiResponse(null, 'Task not found', false, 404);
        }

        $task->deleteWithSubtasks($request->boolean('delete_subtasks'));

        return apiResponse('', 'Task deleted successfully');
    }

    public function move(Request $request, Task $task)
    {

        $validated = $request->validate([
            'status_id'   => 'required|exists:task_statuses,id',
            'position'    => 'required|integer|min:1',
        ]);

        $affectedTasks = $task->updateTaskPosition(
            $task,
            $validated['status_id'],
            $validated['position'],
            $this->userData->id,
            $this->userData->organization_id
        );

        return apiResponse(
            $affectedTasks,
            'Task position updated successfully.'
        );
    }

    /**
     * Bulk update tasks (status, assignees, project, category)
     */
    public function bulkUpdate(Request $request)
    {
        $validated = $request->validate([
            'ids' => 'required|array',
            'ids.*' => 'integer|exists:tasks,id',
            'action' => 'required|string|in:status,assignees,project,category',
            'value' => 'required',
        ]);
        $organization_id = $this->userData->organization_id;
        $userId = $this->userData->id;

        $ids = $validated['ids'];
        $action = $validated['action'];
        $value = $validated['value'];
        // For assignees, value should be array
        if ($action === 'assignees' && !is_array($value)) {
            $value = [$value];
        }
        $updatedTasks = $this->task->bulkUpdate($ids, $action, $value, $userId, $organization_id);
        return apiResponse($updatedTasks, 'Tasks updated successfully');
    }

    public function bulkDelete(Request $request)
    {
        $validated = $request->validate([
            'ids' => 'required|array',
            'ids.*' => 'integer|exists:tasks,id',
            'delete_subtasks' => 'required|boolean',
        ]);
        $organization_id = $this->userData->organization_id;
        $ids = $validated['ids'];
        $deleteSubtasks = $validated['delete_subtasks'];

        $result = $this->task->bulkDelete($ids, $deleteSubtasks, $organization_id);

        return apiResponse($result, 'Tasks deleted successfully');
    }

    public function uploadTaskImage(Request $request)
    {
        $request->validate([
            'image' => 'required|image|max:5120', // 5MB
        ]);
        $org_id = $this->userData->organization_id;
        $orgName = preg_replace('/[^a-zA-Z0-9_\-]/', '_', $org_id->name);
        $path = "images/{$orgName}/task";
        $file = $request->file('image');
        $filename = uniqid('taskimg_') . '.' . $file->getClientOriginalExtension();

        // Ensure directory exists
        Storage::makeDirectory($path);

        // Save to storage/app/images/{org}/task
        $file->storeAs($path, $filename);

        // Return a URL for the frontend to access (you may need a download endpoint)
        return response()->json([
            'url' => "/api/tasks/image/{$orgName}/task/{$filename}",
            'filename' => $filename,
            'folder' => 'task',
            'org' => $orgName,
        ]);
    }

    // Optional: Serve images securely (not public)
    public function getTaskImage($org, $folder, $filename)
    {
        $path = "images/{$org}/{$folder}/{$filename}";
        if (!Storage::exists($path)) {
            abort(404);
        }
        return response()->file(storage_path("app/{$path}"));
    }

    public function deleteTaskImage(Request $request)
    {
        $url = $request->input('url');
        if (!$url) return response()->json(['error' => 'No URL provided'], 400);

        // Parse /api/tasks/image/{org}/{folder}/{filename}
        $matches = [];
        if (preg_match('#/api/tasks/image/([^/]+)/([^/]+)/([^/]+)$#', $url, $matches)) {
            $org = $matches[1];
            $folder = $matches[2];
            $filename = $matches[3];
            $path = "images/{$org}/{$folder}/{$filename}";
            if (Storage::exists($path)) {
                Storage::delete($path);
                return response()->json(['success' => true]);
            }
        }
        return response()->json(['error' => 'File not found'], 404);
    }
}
