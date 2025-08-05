<?php

use App\Support\Sku;

if (!function_exists('setting')) {

    // Helper to get setting by key
    function setting($key, $default = null)
    {
        return cache()->rememberForever("setting_{$key}", function () use ($key, $default) {
            return optional(\App\Models\Setting::where('key', $key)->first())->value ?? $default;
        });
    }
}


if (!function_exists('generateSKU')) {
    /**
     * Generate a unique SKU based on brand, model and existing SKUs.
     *
     * @param string $brand
     * @param string $model
     * @param array $existingSKUs
     * @return string
     */
    function generateSKU($brand, $model, $existingSKUs = []): string
    {
        return Sku::generateSKU($brand, $model, $existingSKUs);
    }
}
