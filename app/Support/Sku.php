<?php

namespace App\Support;

use App\Models\Watch;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Str;

class Sku
{

    /**
     * Check the sku exits
     */
    protected static function skuExists(string $sku, array|string $source, string $key = 'sku'): bool
    {
        // If it's a class name (Laravel Model)
        if (is_string($source) && class_exists($source) && new $source instanceof Model) {
            return $source::where($key, $sku)->exists();
        }

        return in_array($sku, $source);
    }

    /**
     * Generate a unique SKU for a watch.
     * @uses Sku::generate('brand','model')
     * 
     * @param string $brand
     * @param string $model
     * @return string
     */
    public static function generate(string $brand, string $model): string
    {
        // BrandCode: first 3 uppercase letters
        $brandCode = strtoupper(Str::substr($brand, 0, 3));

        // ModelCode: first letter of up to 3 words (excluding numbers)
        $modelCode = collect(explode(' ', $model))
            ->filter(fn($word) => !is_numeric($word))
            ->take(3)
            ->map(fn($word) => strtoupper(Str::substr($word, 0, 1)))
            ->implode('');

        // Pad ModelCode to 3 characters
        $modelCode = str_pad($modelCode, 3, 'X');

        // Base SKU
        $base = "{$brandCode}-{$modelCode}";

        // Fetch latest similar SKU from database
        $lastSku = Watch::where('sku', 'like', "{$base}-%")
            ->orderByDesc('sku')
            ->value('sku');

        $serial = 1;

        if ($lastSku) {
            // Extract last serial
            $lastSerial = (int) Str::afterLast($lastSku, '-');
            $serial = $lastSerial + 1;
        }

        // Return new SKU
        return "{$base}-" . str_pad($serial, 4, '0', STR_PAD_LEFT);
    }


    /**
     * SKU Generation : generate a unique sku
     */
    public static function generateSKU($brand, $model, array|string $modeClass = [])
    {
        if (!$brand || !$model) return "";

        // BrandCode: first 3 letters (uppercase)
        $brandCode = strtoupper(substr($brand, 0, 3));

        // ModelCode: first letters of up to 3 non-numeric words
        $words = preg_split('/\s+/', $model);
        $filteredWords = array_filter($words, function ($w) {
            return !is_numeric($w);
        });

        $modelLetters = array_map(function ($w) {
            return strtoupper(substr($w, 0, 1)) ?: 'X';
        }, array_slice($filteredWords, 0, 3));

        $modelCode = str_pad(implode('', $modelLetters), 3, 'X');

        $base = "{$brandCode}-{$modelCode}";

        // Serial: start from 0001 and find next available
        $serial = 1;
        $sku = "{$base}-" . str_pad($serial, 4, "0", STR_PAD_LEFT);

        while (self::skuExists($sku, $modeClass)) {
            $serial++;
            $sku = "{$base}-" . str_pad($serial, 4, "0", STR_PAD_LEFT);
        }

        return $sku;
    }
}
