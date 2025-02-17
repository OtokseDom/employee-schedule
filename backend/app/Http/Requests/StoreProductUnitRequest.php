<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreProductUnitRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'product_id' => 'required|integer|exists:products,id',
            'product_variation_id' => 'nullable|integer|exists:product_variations,id',
            'unit_id' => 'required|integer|exists:units,id',
            'is_base' => 'required|boolean',
            'factor' => 'required|numeric',
            'base_qty' => 'required|numeric',
            'cost_price' => 'nullable|numeric',
            'selling_price' => 'required|numeric',
            'sale_price' => 'nullable|numeric',
        ];
    }
}
