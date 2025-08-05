<?php

namespace App\Support;

use App\Models\Watch;
use Illuminate\Support\Str;

class Sku
{

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
}
