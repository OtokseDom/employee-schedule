<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ProductUnitResource extends JsonResource
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
            'unit_id' => $this->unit_id,
            'is_base' => $this->is_base,
            'factor' => $this->factor,
            'base_qty' => $this->base_qty,
            'cost_price' => $this->cost_price,
            'selling_price' => $this->selling_price,
            'sale_price' => $this->sale_price,
            'created_at' => $this->created_at->format('Y-m-d H:i:s'),
            // 'unit' => new UnitResource($this->whenLoaded('unit')),
            // For SHOW function
            'unit' => $this->whenLoaded('unit', function () {
                return [
                    'code' => $this->unit->code,
                    'description' => $this->unit->description,
                ];
            }),
        ];
    }
}
