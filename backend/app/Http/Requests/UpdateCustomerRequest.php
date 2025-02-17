<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdateCustomerRequest extends FormRequest
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
            'type' => 'required|numeric|min:1|max:2',
            'category' => 'required|numeric|min:1|max:2',
            'first_name' => 'required|string|max:25',
            'middle_name' => 'nullable|string|max:25',
            'last_name' => 'required|string|max:25',
            'address' => 'nullable|string',
            'phone' => 'nullable|string|max:20',
            'email' => 'nullable|string|max:55',
            'image' => 'nullable|string',
        ];
    }
}
