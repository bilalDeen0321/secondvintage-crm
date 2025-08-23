<?php

namespace App\Http\Requests\Watch;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\Facades\Auth;

class AIGenerateRequest extends FormRequest
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
            'name'              => 'nullable|string',
            'routeKey'          => 'nullable|string',
            'ai_instructions'   => 'nullable|string',
            'ai_thread_id'      => 'nullable|string',
            'sku'               => 'nullable|string',
            'brand'             => 'nullable|string',
            'serial_number'     => 'nullable|string',
            'reference'         => 'nullable|string',
            'case_size'         => 'nullable|string',
            'caliber'           => 'nullable|string',
            'timegrapher'       => 'nullable|string',
            'platform'          => 'nullable|string',
            'status'            => 'nullable|string',

            // images is an array of base64 strings inside objects
            'images.*.id'       => ['nullable'],
            'images.*.file'     => ['nullable', 'file', 'image', 'max:5120'],
            'images.*.useForAI' => ['nullable', 'bool'],
        ];
    }


    /**
     * Custom error messages
     */
    public function messages(): array
    {
        return [
            'images.required'          => 'You must provide at least one image.',
            'images.array'             => 'Images must be provided as an array.',
            'images.*.file.file'       => 'Each image must be a valid file.',
            'images.*.file.image'      => 'Each image must be an actual image (jpg, png, gif, etc.).',
            'images.*.file.max'        => 'Each image may not be greater than 5 MB.',
        ];
    }
}
