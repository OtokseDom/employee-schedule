<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreVehicleRequest extends FormRequest
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
            'name' => 'required|string|max:25',
            'type' => 'required|string|max:55',
            'make' => 'required|string|max:55',
            'model' => 'required|string|max:25',
            'plate_number' => 'required|string|max:25',
            'vehicle_id' => 'required|string|max:25',
            'capacity' => 'required|string',
            'dimension' => 'required|string',
            'weight_capacity' => 'required|string',
        ];
    }
}
