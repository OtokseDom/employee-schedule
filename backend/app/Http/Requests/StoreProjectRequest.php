<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreProjectRequest extends FormRequest
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
            'status_id' => 'nullable|exists:task_statuses,id',
            'title'           => 'required|string|max:255',
            'description'     => 'nullable|string',
            'target_date'     => 'nullable|date',
            'estimated_date'  => 'nullable|date',
            'priority'        => 'nullable|in:Low,Medium,High,Urgent,Critical',
            'remarks'         => 'nullable|string',
        ];
    }
}
