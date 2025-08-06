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
