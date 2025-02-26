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
            'employee_id' => $this->employee_id,
            'event_id' => $this->event_id,
            'date' => $this->date,
            'shift_start' => $this->shift_start,
            'shift_end' => $this->shift_end,
            'status' => $this->status,
            'created_at' => $this->created_at->format('Y-m-d H:i:s'),
            'updated_at' => $this->updated_at->format('Y-m-d H:i:s'),
            // 'employee' => new EmployeeResource($this->whenLoaded('employee')),
            // For SHOW function
            'employee' => $this->whenLoaded('employee', function () {
                return [
                    'name' => $this->employee->name,
                    'position' => $this->employee->position,
                    'dob' => $this->employee->dob,
                ];
            }),
            'event' => $this->whenLoaded('event', function () {
                return [
                    'name' => $this->event->name,
                    'description' => $this->event->description,
                    'color' => $this->event->color,
                ];
            }),
        ];
    }
}