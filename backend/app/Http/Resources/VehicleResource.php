<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class VehicleResource extends JsonResource
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
            'name' => $this->name,
            'type' => $this->type,
            'make' => $this->make,
            'model' => $this->model,
            'plate_number' => $this->plate_number,
            'vehicle_id' => $this->vehicle_id,
            'capacity' => $this->capacity,
            'dimension' => $this->dimension,
            'weight_capacity' => $this->weight_capacity,
            'created_at' => $this->created_at->format('Y-m-d H:i:s'),
        ];
    }
}
