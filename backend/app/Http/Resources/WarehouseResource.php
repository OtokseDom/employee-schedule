<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class WarehouseResource extends JsonResource
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
            'code' => $this->code,
            'description' => $this->description,
            'country' => $this->country,
            'city' => $this->city,
            'region' => $this->region,
            'address_line' => $this->address_line,
            'manager' => $this->manager,
            'phone' => $this->phone,
            'email' => $this->email,
            'created_at' => $this->created_at->format('Y-m-d H:i:s'),
        ];
    }
}
