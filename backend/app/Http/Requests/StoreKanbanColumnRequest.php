<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StoreKanbanColumnRequest extends FormRequest
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
            'project_id' => ['required', 'exists:projects,id'],
            'task_status_id' => ['required', 'exists:task_statuses,id'],
            'position' => [
                'required',
                'integer',
                'min:1',
                // unique per project + status + position
                Rule::unique('kanban_columns')->where(function ($query) {
                    return $query
                        ->where('project_id', $this->input('project_id'))
                        ->where('task_status_id', $this->input('task_status_id'));
                }),
            ],
        ];
    }

    public function messages(): array
    {
        return [
            'position.unique' => 'This position is already taken for the project-status combination.',
        ];
    }
}
