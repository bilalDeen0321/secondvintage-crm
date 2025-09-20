<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdateWishlistRequest extends FormRequest
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
           'brand_id' => 'required|integer|exists:brands,id',
            'model' => 'required|string|max:255',
            'description' => 'nullable|string|max:1000',
            'price_range_min' => 'required|numeric|min:0',
            'price_range_max' => 'required|numeric|min:0|gte:price_range_min',
            'priority' => 'required|in:High,Medium,Low',
            'image_url' => 'nullable|image|mimes:jpg,jpeg,png|max:2048',
        ];
    }
}
