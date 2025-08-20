<?php

namespace App\Http\Requests;

use App\Models\Watch;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;
use Illuminate\Validation\Rule;


/**
 * @var \Illuminate\Http\Request $this
 */
class UpdateWatchRequest extends FormRequest
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

        $watch_id = $this->watch->id ?? '';

        return array_merge($rules->rules(), [
            'sku'             => 'nullable|string|max:255|unique:watches,sku,' . $watch_id,
        ]);
    }
}
