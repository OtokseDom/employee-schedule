<?php

namespace App\Http\Controllers\Api\v1;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreTaskImageRequest;
use App\Http\Resources\TaskImageResource;
use App\Models\TaskImage;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;

class TaskImageController extends Controller
{
    protected TaskImage $taskImage;
    protected $userData;
    public function __construct(TaskImage $taskImage)
    {
        $this->taskImage = $taskImage;
        $this->userData = Auth::user();
    }
    public function store(StoreTaskImageRequest $request)
    {
        $file = $request->file('image');

        $path = $file->store('task_images/' . $this->userData->organization_id, 'public'); // saves to storage/app/public/task_images

        $taskImage = TaskImage::create([
            'task_id'       => $request->task_id,
            'filename'      => $path,
            'original_name' => $file->getClientOriginalName(),
            'mime_type'     => $file->getClientMimeType(),
            'size'          => $file->getSize(),
            'url'           => asset('storage/' . $path), // optional if using CDN
        ]);

        return new TaskImageResource($taskImage);
    }

    public function destroy(TaskImage $taskImage)
    {
        // optional: delete from storage
        Storage::disk('public')->delete($taskImage->filename);

        $taskImage->delete();

        return response()->json(['message' => 'Image deleted']);
    }
}
