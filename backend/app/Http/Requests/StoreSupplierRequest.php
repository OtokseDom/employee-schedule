<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreSupplierRequest extends FormRequest
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
            'name' => 'required|string|max:25',
            'type' => 'required|numeric|min:1|max:2',
            'category' => 'required|numeric|min:1|max:2',
            'phone' => 'nullable|string|max:20',
            'email' => 'nullable|string|max:55',
            'image' => 'nullable|string',
            'address' => 'nullable|string',
        ];
    }
}
