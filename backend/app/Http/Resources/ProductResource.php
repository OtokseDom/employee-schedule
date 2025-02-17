<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ProductResource extends JsonResource
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
            'highlight' => $this->highlight,
            'specification' => $this->specification,
            'description' => $this->description,
            'created_at' => $this->created_at->format('Y-m-d H:i:s'),
            // Include related ProductVariation data for this product
            'variations' => $this->whenLoaded('variations', function () {
                return $this->variations->map(function ($variation) {
                    return [
                        'SKU' => $variation->SKU,
                        'name' => $variation->name,
                        'short_name' => $variation->short_name,
                        'barcode' => $variation->barcode,

                        // Ensure the units relationship is loaded before attempting to map
                        'units' => $variation->units->map(function ($unit) {
                            return [
                                'unit_id' => $unit->unit_id,
                                'is_base' => $unit->is_base,
                                'factor' => $unit->factor,
                                'cost_price' => $unit->cost_price,
                                'selling_price' => $unit->selling_price,
                                'sale_price' => $unit->sale_price,
                                'base_qty' => $unit->base_qty,
                            ];
                        }),
                    ];
                });
            }),
        ];
    }
}
