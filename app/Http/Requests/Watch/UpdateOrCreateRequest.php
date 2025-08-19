<?php

namespace App\Http\Requests\Watch;

use App\Http\Requests\StoreWatchRequest;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\Facades\Auth;
use Illuminate\Validation\Rule;

class UpdateOrCreateRequest extends FormRequest
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
        $rules = new StoreWatchRequest();

        return array_merge($rules->rules(), [
            'sku'             => [
                'nullable',
                'string',
                'max:255',
                Rule::unique('watches', 'sku')->ignore($this->route('watch')->id),
            ]
        ]);
    }
}
