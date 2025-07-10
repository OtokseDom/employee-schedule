<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Contracts\Validation\Validator;
use Illuminate\Http\Exceptions\HttpResponseException;
use Illuminate\Validation\Rules\Password;

class SignupRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     *
     * @return bool
     */
    public function authorize()
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, mixed>
     */
    public function rules()
    {
        return [
            'organization_name' => 'nullable|string|max:55|required_without:organization_code',
            'organization_code' => 'nullable|string|required_without:organization_name',
            'name' => 'required|string|max:55',
            'role' => 'required|string',
            'email' => 'required|email|unique:users,email',
            'position' => 'required|string',
            'dob' => 'required|date',
            'password' => [
                'required',
                'confirmed',
                Password::min(8)
                    ->letters()
                    ->symbols()
            ]
        ];
    }

    /**
     * Custom validation failure response for API.
     */
    protected function failedValidation(Validator $validator)
    {
        throw new HttpResponseException(response()->json([
            'success' => false,
            'message' => 'Validation failed',
            'data' => null,
            'errors' => $validator->errors(),
        ], 422));
    }
}
