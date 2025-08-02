<?php


if (!function_exists('setting')) {

    // Helper to get setting by key
    function setting($key, $default = null)
    {
        return cache()->rememberForever("setting_{$key}", function () use ($key, $default) {
            return optional(\App\Models\Setting::where('key', $key)->first())->value ?? $default;
        });
    }
}
