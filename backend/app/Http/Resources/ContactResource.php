<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ContactResource extends JsonResource
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
            'country' => $this->country,
            'region' => $this->region,
            'city' => $this->city,
            'address_line' => $this->address_line,
            'phone' => $this->phone,
            'email' => $this->email,
            'description' => $this->description,
            'created_at' => $this->created_at->format('Y-m-d H:i:s'),
        ];
    }
}
