<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreTaskRequest extends FormRequest
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
            'category' => 'required|string|max:255',
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'expected_output' => 'nullable|string',
            'assignee_id' => 'nullable|exists:users,id',
            'status' => 'required|in:Pending,In Progress,Completed,Delayed,Cancelled,On Hold',
            'start_date' => 'required|date',
            'end_date' => 'required|date|after_or_equal:start_date',
            'time_estimate' => 'nullable|numeric',
            'time_taken' => 'nullable|numeric',
            'delay' => 'nullable|numeric',
            'delay_reason' => 'nullable|string',
            'performance_rating' => 'nullable|integer|min:0|max:100',
            'remarks' => 'nullable|string',
        ];
    }
}