<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StorePerformanceReportRequest extends FormRequest
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
            'user_id' => 'required|exists:users,id',
            'average_rating' => 'required|numeric|min:0|max:5',
            'total_tasks' => 'required|integer|min:0',
            'tasks_on_time' => 'required|integer|min:0',
            'tasks_delayed' => 'required|integer|min:0',
            'tasks_pending' => 'required|integer|min:0',
            'tasks_completed' => 'required|integer|min:0',
            'tasks_in_progress' => 'required|integer|min:0',
            'tasks_cancelled' => 'required|integer|min:0',
            'tasks_on_hold' => 'required|integer|min:0',
            'assessment_date' => 'required|date',
        ];
    }
}