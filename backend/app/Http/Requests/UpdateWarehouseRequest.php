<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdateWarehouseRequest extends FormRequest
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
            'code' => 'required|string|max:25',
            'type' => 'nullable|string|max:55',
            'description' => 'nullable|string|max:55',
            'country' => 'required|string|max:25',
            'city' => 'required|string|max:25',
            'region' => 'nullable|string|max:25',
            'manager' => 'nullable|string',
            'address_line' => 'nullable|string',
            'phone' => 'nullable|string|max:20',
            'email' => 'nullable|string|max:55',
        ];
    }
}
