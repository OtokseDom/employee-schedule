<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreTaskHistoryRequest extends FormRequest
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
            'task_id' => 'required|exists:tasks,id',
            'status_id' => 'nullable|exists:task_statuses,id',
            'changed_by' => 'required|exists:users,id',
            'changed_at' => 'required|date',
            'remarks' => 'nullable|string',
        ];
    }
}
