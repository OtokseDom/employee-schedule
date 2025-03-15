<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class PerformanceReportResource extends JsonResource
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
            'user_id' => $this->user_id,
            'average_rating' => $this->average_rating,
            'total_tasks' => $this->total_tasks,
            'tasks_on_time' => $this->tasks_on_time,
            'tasks_delayed' => $this->tasks_delayed,
            'tasks_pending' => $this->tasks_pending,
            'tasks_completed' => $this->tasks_completed,
            'tasks_in_progress' => $this->tasks_in_progress,
            'tasks_cancelled' => $this->tasks_cancelled,
            'tasks_on_hold' => $this->tasks_on_hold,
            'assessment_date' => $this->assessment_date->format('Y-m-d'),
            'created_at' => $this->created_at->format('Y-m-d H:i:s'),
            'updated_at' => $this->updated_at->format('Y-m-d H:i:s'),
            'user' => $this->whenLoaded('user', function () {
                return [
                    'name' => $this->user->name,
                    'email' => $this->user->email,
                ];
            }),
        ];
    }
}