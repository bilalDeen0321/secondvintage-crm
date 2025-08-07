<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\Facades\Auth;

class StoreWatchRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return Auth::check();
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'name' => ['required', 'string', 'max:255'],
            'sku' => ['required', 'string', 'max:255', 'unique:watches,sku'],
            'brand' => ['required', 'string'],
            'acquisitionCost' => ['nullable', 'numeric'],
            'status' => ['required', 'exists:statuses,name'],
            'location' => ['nullable', 'exists:locations,id'],
            'batch' => ['nullable', 'string'],
            'description' => ['nullable', 'string'],
            'notes' => ['nullable', 'string'],
            'serial' => ['nullable', 'string'],
            'ref' => ['nullable', 'string'],
            'caseSize' => ['nullable', 'string'],
            'caliber' => ['nullable', 'string'],
            'timegrapher' => ['nullable', 'string'],
            'aiInstructions' => ['nullable', 'string'],
            'currency' => ['nullable', 'string'],
            'images' => ['nullable', 'array'],
            'images.*' => ['file', 'image'],
        ];
    }
}
