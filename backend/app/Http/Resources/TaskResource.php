<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class TaskResource extends JsonResource
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
            'category' => $this->category,
            'title' => $this->title,
            'description' => $this->description,
            'expected_output' => $this->expected_output,
            'assignee_id' => $this->assignee_id,
            'status' => $this->status,
            'start_date' => $this->start_date,
            'end_date' => $this->end_date,
            'time_estimate' => $this->time_estimate,
            'time_taken' => $this->time_taken,
            'delay' => $this->delay,
            'delay_reason' => $this->delay_reason,
            'performance_rating' => $this->performance_rating,
            'remarks' => $this->remarks,
            'created_at' => $this->created_at->format('Y-m-d H:i:s'),
            'updated_at' => $this->updated_at->format('Y-m-d H:i:s'),
            'assignee' => $this->whenLoaded('assignee', function () {
                return [
                    'name' => $this->assignee->name,
                    'email' => $this->assignee->email,
                    'role' => $this->assignee->role,
                    'position' => $this->assignee->position,
                ];
            }),
        ];
    }
}