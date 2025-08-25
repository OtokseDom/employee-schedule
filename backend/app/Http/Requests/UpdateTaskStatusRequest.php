<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateTaskStatusRequest extends FormRequest
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
            'organization_id' => 'required|exists:organizations,id',
            'name' => [
                'required',
                'string',
                'max:255',
                Rule::unique('task_statuses', 'name')
                    ->where(fn($query) => $query->where('organization_id', $this->organization_id)),
            ],
            'description' => 'nullable|string',
            'color' => 'nullable|string'
        ];
    }
}
