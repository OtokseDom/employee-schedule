<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ProjectResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        // return parent::toArray($request);
        return [
            'id'             => $this->id,
            'organization_id' => $this->organization_id,
            'status_id' => $this->status_id,
            'title'          => $this->title,
            'description'    => $this->description,
            'target_date'    => $this->target_date,
            'estimated_date' => $this->estimated_date,
            'priority'       => $this->priority,
            'remarks'        => $this->remarks,
            'created_at'     => $this->created_at->format('Y-m-d H:i:s'),
            'updated_at'     => $this->updated_at->format('Y-m-d H:i:s'),
            'status' => $this->whenLoaded('status', function () {
                return $this->status ? [
                    'name' => $this->status->name,
                    'color' => $this->status->color
                ] : null;
            }),
        ];
    }
}