<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreScheduleRequest extends FormRequest
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
            'event_id' => 'required|exists:events,id',
            'user_id' => 'required|exists:users,id',
            'date' => 'required|date_format:Y-m-d',
            'shift_start' => 'required|date_format:H:i:s',
            'shift_end' => 'required|date_format:H:i:s|after:shift_start', // Ensure shift_end is a valid time and after shift_start
            'status' => 'required|in:Pending,Completed,In Progress,Cancelled',
        ];
    }
    public function messages()
    {
        return [
            'shift_end.after' => 'The shift end time must be after the shift start time.',
        ];
    }
}