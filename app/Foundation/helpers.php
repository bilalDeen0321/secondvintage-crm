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
     * @param array|string $modeClass laravel model class string or array of slugs
     * @return string
     */
    function generateSKU($brand, $model, $modeClass = [], $oldSku = null): string
    {
        return Sku::generateSKU($brand, $model, $modeClass, $oldSku);
    }
}
if (!function_exists('ai_description_format')) {
    /**
     * Generate a unique SKU based on brand, model and existing SKUs.
     *
     * @param string $brand
     * @param string $model
     * @param array|string $modeClass laravel model class string or array of slugs
     * @return string
     */
    function ai_description_format($str = ''): string
    {
        return str_replace('\n', "\n", str_replace('\n\n', "\n\n", $str));
        $first_string = nl2br(str_replace('\n\n', "\n", $str));

        return (str_replace('\n', "\n", $first_string));
    }
}
