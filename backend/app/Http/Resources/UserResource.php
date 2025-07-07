<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class UserResource extends JsonResource
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
            'id' => $this->id,
            'organization_id' => $this->organization_id,
            'name' => $this->name,
            'position' => $this->position,
            'dob' => $this->dob,
            'role' => $this->role,
            'email' => $this->email,
            'status' => $this->status,
            'created_at' => $this->created_at->format('Y-m-d H:i:s'),
            'updated_at' => $this->updated_at->format('Y-m-d H:i:s'),
            'organization' => new OrganizationResource($this->whenLoaded('organization')),
            // 'organization' => $this->whenLoaded('organization', function () {
            //     return [
            //         'name' => $this->organization->name,
            //         'description' => $this->organization->description,
            //         'code' => $this->organization->code
            //     ];
            // }),
        ];
    }
}
