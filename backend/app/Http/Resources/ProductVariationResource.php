<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ProductVariationResource extends JsonResource
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
            'product_id' => $this->product_id,
            'SKU' => $this->SKU,
            'name' => $this->name,
            'short_name' => $this->short_name,
            'barcode' => $this->barcode,
            'created_at' => $this->created_at->format('Y-m-d H:i:s'),
            // 'product' => new ProductResource($this->whenLoaded('product')),
            // 'unit' => new UnitResource($this->whenLoaded('unit')),
            'product' => $this->whenLoaded('product', function () {
                return [
                    'highlight' => $this->product->highlight,
                    'specification' => $this->product->specification,
                    'description' => $this->product->description,
                ];
            }),
            'units' => $this->whenLoaded('productUnits'),

        ];
    }
}
