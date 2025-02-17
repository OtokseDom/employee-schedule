<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class SupplierResource extends JsonResource
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
            'category' => $this->category,
            'phone' => $this->phone,
            'email' => $this->email,
            'image' => $this->image,
            'address' => $this->address,
            'created_at' => $this->created_at->format('Y-m-d H:i:s'),
        ];
    }
}
