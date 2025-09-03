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

    //Contraints platform names.
    const PlATFORM_CATAWIKI = 'catawiki';
    const PlATFORM_TRADERA = 'tradera';
    const PlATFORM_EBAY = 'eBay';
    const PlATFORM_CHRONO24 = 'Chrono24';

    /**
     * All supported platforms.
     */
    const PLATFORMS = [
        self::PlATFORM_CATAWIKI,
        self::PlATFORM_TRADERA,
        self::PlATFORM_EBAY,
        self::PlATFORM_CHRONO24
    ];

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
