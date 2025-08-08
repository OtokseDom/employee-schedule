<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdateTaskRequest extends FormRequest
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
            'project_id' => 'required|exists:projects,id',
            'category_id' => 'required|exists:categories,id',
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'expected_output' => 'nullable|string',
            'assignee_id' => 'nullable|exists:users,id',
            'status' => 'required|in:Pending,In Progress,For Review,Completed,Delayed,Cancelled,On Hold',
            'start_date' => 'nullable|date',
            'end_date' => 'nullable|date|after_or_equal:start_date',
            'start_time' => 'nullable|date_format:H:i:s',
            'end_time' => 'nullable|date_format:H:i:s|after:start_time',
            'time_estimate' => 'nullable|numeric|min:0.1',
            'time_taken' => 'nullable|numeric|min:0',
            'delay' => 'nullable|numeric|min:0',
            'delay_reason' => 'nullable|string',
            'performance_rating' => 'nullable|integer|min:0|max:10',
            'remarks' => 'nullable|string',
        ];
    }

    /**
     * Get the error messages for the defined validation rules.
     *
     * @return array<string, string>
     */
    public function messages(): array
    {
        return [
            'organization_id.required' => 'Organization is required.',
            'project_id.required' => 'Project is required.',
            'category_id.required' => 'Category is required.',
            'title.required' => 'Title is required.',
            'status.required' => 'Status is required.',
            'end_date.after_or_equal' => 'End date must be after or equal to start date.',
            'end_time.after' => 'The end time must be after the start time.',
            'performance_rating.min' => 'Performance rating must be at least 0.',
            'performance_rating.max' => 'Performance rating may not be greater than 10.',
            'time_estimate' => 'Time estimate must be greater than 0',
            'time_taken' => 'Actual time must be greater than 0',
            'delay' => 'Delay time must be greater than 0 or set to null',
            // ...other custom messages...
        ];
    }
}
