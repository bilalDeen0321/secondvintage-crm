<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class PlatformData extends Model
{
    use HasFactory;

    // ---- Status constants ----
    const STATUS_REVIEW   = 'review';
    const STATUS_DEFAULT  = 'default';
    const STATUS_APPROVED = 'approved';
    const STATUS_LOADING  = 'loading';
    const STATUS_FAILED   = 'failed';
    const STATUS_SUCCESS  = 'success';

    // ---- Platform constants ----
    const CATAWIKI     = 'catawiki';
    const TRADERA      = 'tradera';
    const EBAY_FIXED   = 'ebay_fixed';
    const EBAY_AUCTION = 'ebay_auction';
    const CHRONO24     = 'chrono24';
    const WEBSHOP      = 'webshop';

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
     * Unified platform config: slug => [label, color]
     */
    public static function platforms(): array
    {
        return [
            self::CATAWIKI     => ['label' => 'Catawiki (Auction)',      'color' => '#3b82f6'],
            self::TRADERA      => ['label' => 'Tradera (Auction)',       'color' => '#10b981'],
            self::EBAY_FIXED   => ['label' => 'eBay (Fixed Price)',      'color' => '#8b5cf6'],
            self::EBAY_AUCTION => ['label' => 'eBay (Auction)',          'color' => '#ec4899'],
            self::CHRONO24     => ['label' => 'Chrono24 (Fixed Price)',  'color' => '#f97316'],
            self::WEBSHOP      => ['label' => 'Webshop (Fixed Price)',   'color' => '#22d3ee'],
        ];
    }

    /**
     * Return all platform slugs.
     */
    public static function allSlugs(): array
    {
        return array_keys(self::platforms());
    }

    /**
     * Map slug to label.
     */
    public static function toLabel(string $slug): string
    {
        return self::platforms()[$slug]['label'] ?? ucfirst($slug);
    }

    /**
     * Map slug to color.
     */
    public static function toColor(string $slug): string
    {
        return self::platforms()[$slug]['color'] ?? '#9ca3af'; // fallback gray
    }

    protected $fillable = [
        'watch_id',
        'name',
        'data',
        'message',
        'status',
    ];

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
