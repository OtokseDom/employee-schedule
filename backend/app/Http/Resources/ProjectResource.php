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
            'title'          => $this->title,
            'description'    => $this->description,
            'target_date'    => $this->target_date,
            'estimated_date' => $this->estimated_date,
            'priority'       => $this->priority,
            'status'         => $this->status,
            'remarks'        => $this->remarks,
            'created_at'     => $this->created_at->format('Y-m-d H:i:s'),
            'updated_at'     => $this->updated_at->format('Y-m-d H:i:s'),
        ];
    }
}
