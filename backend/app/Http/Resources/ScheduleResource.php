<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ScheduleResource extends JsonResource
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
            'title' => $this->title,
            'category' => $this->category,
            'start_date' => $this->start_date,
            'end_date' => $this->end_date,
            'start_time' => $this->start_time,
            'end_time' => $this->end_time,
            'description' => $this->description,
            'assignee_id' => $this->assignee, // always the user id
            'status' => $this->status,
            'created_at' => $this->created_at->format('Y-m-d H:i:s'),
            'updated_at' => $this->updated_at->format('Y-m-d H:i:s'),
            'assignee' => $this->whenLoaded('assignee', function () {
                return [
                    'name' => $this->assignee->name,
                    'position' => $this->assignee->position,
                    'dob' => $this->assignee->dob,
                    'role' => $this->assignee->role,
                    'email' => $this->assignee->email,
                ];
            }),
        ];
    }
}