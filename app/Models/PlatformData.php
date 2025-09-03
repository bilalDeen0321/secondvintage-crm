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
    const CATAWIKI = 'catawiki';
    const TRADERA = 'tradera';
    const EBAY_FIXED = 'ebay_fixed';
    const EBAY_AUCTION = 'eBay_action';
    const CHRONO24 = 'chrono24';
    const WEBSHOP = 'bebshop';

    /**
     * All supported platforms.
     */
    public static function all_patforms()
    {
        return [
            self::CATAWIKI,
            self::TRADERA,
            self::EBAY_FIXED,
            self::EBAY_AUCTION,
            self::CHRONO24,
            self::WEBSHOP,
        ];
    }

    /**
     * Platforms array to map labels
     */
    public static function toLabel($platformName)
    {
        $labels = [
            self::CATAWIKI => 'Catawiki (Auction)',
            self::TRADERA => 'Tradera (Auction)',
            self::EBAY_FIXED => 'eBay (Fixed Price)',
            self::EBAY_AUCTION => 'eBay (Auction)',
            self::CHRONO24 => 'Chrono24 (Fixed Price)',
            self::WEBSHOP => 'Webshop (Fixed Price)',
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
        'message',
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
