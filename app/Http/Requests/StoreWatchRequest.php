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
            'name'            => ['required', 'string', 'max:255'],
            'sku'             => ['required', 'string', 'max:255', 'unique:watches,sku'],
            'brand'           => ['required', 'string', 'max:255'],
            'status'          => ['required', 'string', 'max:255'],
            'serial_number'   => ['nullable', 'string', 'max:255'],
            'reference'       => ['nullable', 'string', 'max:255'],
            'case_size'       => ['nullable', 'string', 'max:255'],
            'caliber'         => ['nullable', 'string', 'max:255'],
            'timegrapher'     => ['nullable', 'string', 'max:255'],
            'original_cost'   => ['nullable', 'numeric'],
            'current_cost'    => ['nullable', 'numeric'],
            'location'        => ['nullable', 'string', 'max:255'],
            'batch'           => ['nullable', 'string', 'max:255'],
            'description'     => ['nullable', 'string'],
            'currency'        => ['nullable', 'string', 'max:3'],
            'notes'           => ['nullable', 'string'],
            'ai_instructions' => ['nullable', 'string'],
            'ai_thread_id'    => ['nullable', 'string'],

            // images is an array of base64 strings inside objects
            'images'          => ['nullable', 'array'],
            // 'images.*.url'    => ['required_with:images', 'string'],
            'images.*.file'    => ['nullable', 'file', 'image', 'max:5120'],

        ];
    }
}
