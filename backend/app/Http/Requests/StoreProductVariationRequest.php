<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreProductVariationRequest extends FormRequest
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

    public function rules()
    {
        return [
            'description' => 'required|string|max:255',
            'highlight' => 'nullable|string',
            'specification' => 'nullable|string',

            // Validating the variations array
            'variations' => 'required|array',
            'variations.*.SKU' => 'required|string|max:255',
            'variations.*.name' => 'required|string|max:255',
            'variations.*.short_name' => 'nullable|string|max:255',
            'variations.*.barcode' => 'nullable|string|max:255',

            // Validating units inside each variation
            'variations.*.product_units' => 'required|array',
            'variations.*.product_units.*.unit_id' => 'required|numeric', // Unit code or unit_id
            'variations.*.product_units.*.is_base' => 'required|boolean',
            'variations.*.product_units.*.factor' => 'required|numeric',
            'variations.*.product_units.*.cost_price' => 'required|numeric',
            'variations.*.product_units.*.selling_price' => 'required|numeric',
            'variations.*.product_units.*.sale_price' => 'nullable|numeric',
            'variations.*.product_units.*.base_qty' => 'required|numeric|min:1',
        ];
    }

    public function attributes()
    {
        return [
            'description' => 'product description',
            'highlight' => 'product highlights',
            'specification' => 'product specifications',
            'variations' => 'product variations',
            'variations.*.SKU' => 'SKU',
            'variations.*.name' => 'variation name',
            'variations.*.short_name' => 'variation short name',
            'variations.*.barcode' => 'variation barcode',
            'variations.*.product_units' => 'product units',
            'variations.*.product_units.*.unit_id' => 'unit code',
            'variations.*.product_units.*.is_base' => 'is base',
            'variations.*.product_units.*.factor' => 'unit factor',
            'variations.*.product_units.*.cost_price' => 'unit cost price',
            'variations.*.product_units.*.selling_price' => 'unit selling price',
            'variations.*.product_units.*.sale_price' => 'unit sale price',
            'variations.*.product_units.*.base_qty' => 'unit base quantity',
        ];
    }
    // public function rules(): array
    // {
    //     return [
    //         'product_id' => 'required|integer|exists:products,id',
    //         'SKU' => 'string',
    //         'name' => 'required|string|max:100',
    //         'short_name' => 'required|string|max:30',
    //         'barcode' => 'nullable|string',
    //     ];
    // }

}
