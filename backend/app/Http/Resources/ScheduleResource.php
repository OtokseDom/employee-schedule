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
            'user_id' => $this->user_id,
            'event_id' => $this->event_id,
            'date' => $this->date,
            'shift_start' => $this->shift_start,
            'shift_end' => $this->shift_end,
            'status' => $this->status,
            'created_at' => $this->created_at->format('Y-m-d H:i:s'),
            'updated_at' => $this->updated_at->format('Y-m-d H:i:s'),
            // 'user' => new EmployeeResource($this->whenLoaded('user')),
            // For SHOW function
            'user' => $this->whenLoaded('user', function () {
                return [
                    'name' => $this->user->name,
                    'position' => $this->user->position,
                    'dob' => $this->user->dob,
                    'role' => $this->user->role,
                    'email' => $this->user->email,
                ];
            }),
            'event' => $this->whenLoaded('event', function () {
                return [
                    'name' => $this->event->name,
                    'description' => $this->event->description,
                ];
            }),
        ];
    }
}