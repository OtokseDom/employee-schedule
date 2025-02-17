<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdateStorageRequest extends FormRequest
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
            'warehouse_id' => 'required|numeric',
            'name' => 'required|string|max:25',
            'code' => 'required|string|max:25',
            'type' => 'required|numeric',
            'description' => 'nullable|string|max:55',
            'capacity' => 'nullable|string',
            'dimension' => 'nullable|string',
            'weight_capacity' => 'nullable|string',
            'status' => 'required|numeric',
        ];
    }
}
