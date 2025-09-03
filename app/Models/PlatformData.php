<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class PlatformData extends Model
{
    /** @use HasFactory<\Database\Factories\PlatformDataFactory> */
    use HasFactory;

    // defines all status constants
    const STATUS_REVIEW = 'review';
    const STATUS_DEFAULT = 'default';
    const STATUS_APPROVED = 'approved';
    const STATUS_LOADING = 'loading';
    const STATUS_FAILED = 'failed';
    const STATUS_SUCCESS = 'success';

    // Platform name constants
    const PLATFORM_CATAWIKI = 'catawiki';
    const PLATFORM_TRADERA = 'tradera';
    const PLATFORM_EBAY_FIXED = 'ebay_fixed';
    const PLATFORM_EBAY_AUCTION = 'eBay_action';
    const PLATFORM_CHRONO24 = 'chrono24';
    const PLATFORM_WEBSHOP = 'bebshop';

    /**
     * All supported platforms.
     */
    public static function all_patforms()
    {
        return [
            self::PLATFORM_CATAWIKI,
            self::PLATFORM_TRADERA,
            self::PLATFORM_EBAY_FIXED,
            self::PLATFORM_EBAY_AUCTION,
            self::PLATFORM_CHRONO24,
            self::PLATFORM_WEBSHOP,
        ];
    }

    /**
     * Platforms array to map labels
     */
    public static function toLabel($platformName)
    {
        $labels = [
            self::PLATFORM_CATAWIKI => 'Catawiki (Auction)',
            self::PLATFORM_TRADERA => 'Tradera (Auction)',
            self::PLATFORM_EBAY_FIXED => 'eBay (Fixed Price)',
            self::PLATFORM_EBAY_AUCTION => 'eBay (Auction)',
            self::PLATFORM_CHRONO24 => 'Chrono24 (Fixed Price)',
            self::PLATFORM_WEBSHOP => 'Webshop (Fixed Price)',
        ];

        return $labels[$platformName] ?? $platformName;
    }

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'watch_id',
        'name',
        'data',
        'status',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'data' => 'array', // Automatically cast JSON to array/object
        ];
    }

    public function watch()
    {
        return $this->belongsTo(Watch::class);
    }
}
