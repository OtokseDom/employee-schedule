<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class TaskHistoryResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'organization_id' => $this->organization_id,
            'task_id' => $this->task_id,
            'status' => $this->status,
            'changed_by' => $this->changed_by,
            'changed_at' => $this->changed_at->format('Y-m-d H:i:s'),
            'remarks' => $this->parseRemarks($this->remarks),
            'created_at' => $this->created_at->format('Y-m-d H:i:s'),
            'updated_at' => $this->updated_at->format('Y-m-d H:i:s'),
            'task' => $this->whenLoaded('task', function () {
                return [
                    'title' => $this->task->title,
                ];
            }),
            'changedBy' => $this->whenLoaded('changedBy', function () {
                return [
                    'name' => $this->changedBy->name
                ];
            }),
        ];
    }
    protected function parseRemarks($remarks)
    {
        $decoded = json_decode($remarks, true);
        return json_last_error() === JSON_ERROR_NONE ? $decoded : $remarks;
    }
}
