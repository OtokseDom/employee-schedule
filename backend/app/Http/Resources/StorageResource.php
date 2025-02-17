<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class StorageResource extends JsonResource
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
            'warehouse_id' => $this->warehouse_id,
            'name' => $this->name,
            'type' => $this->type,
            'code' => $this->code,
            'description' => $this->description,
            'capacity' => $this->capacity,
            'dimension' => $this->dimension,
            'weight_capacity' => $this->weight_capacity,
            'status' => $this->status,
            'created_at' => $this->created_at->format('Y-m-d H:i:s'),
            'warehouse' => $this->whenLoaded('warehouse', function () {
                return [
                    'name' => $this->warehouse->name,
                ];
            }),
        ];
    }
}
