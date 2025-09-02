<?php

namespace App\Models;

use App\Packages\Utils\Traits\HasModelHelpers;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class WatchPlatform extends Model
{
    /** @use HasFactory<\Database\Factories\WatchPlatformFactory> */
    use HasFactory, HasModelHelpers;

    /**
     * Assign the table name explicitly
     */
    protected $table = 'watch_platform';

    /**
     * Constants for platform names
     */
    const PLATFORM_TRADERA = 'tradera';
    const PLATFORM_CAKATIWI = 'cakatiwi';
    const PLATFORM_CHRONO24 = 'chrono24';
    const PLATFORM_EBAY = 'ebay';
    const PLATFORM_C24 = 'c24';

    /**
     * Constants for status values
     */
    const STATUS_DEFAULT = 'default';
    const STATUS_PENDING = 'pending';
    const STATUS_LISTED = 'listed';
    const STATUS_SOLD = 'sold';
    const STATUS_ERROR = 'error';
    const STATUS_DELISTED = 'delisted';
    const STATUS_UNLISTED = 'unlisted';
    const STATUS_ARCHIVED = 'archived';
    const STATUS_LOADING = 'loading';
    const STATUS_COMPLETE = 'complete';
    const STATUS_SUCCESS = 'success';
    const STATUS_FAILED = 'failed';

    //all status in one constant
    const ALL_STATUSES = [
        self::STATUS_DEFAULT,
        self::STATUS_PENDING,
        self::STATUS_LISTED,
        self::STATUS_SOLD,
        self::STATUS_ERROR,
        self::STATUS_DELISTED,
        self::STATUS_UNLISTED,
        self::STATUS_ARCHIVED,
        self::STATUS_LOADING,
        self::STATUS_COMPLETE,
        self::STATUS_SUCCESS,
        self::STATUS_FAILED,
    ];

    /**
     * The attributes that are mass assignable.
     */
    protected $fillable = [
        'watch_id',
        'name',
    ];

    /**
     * Get the watch that owns the platform.
     */
    public function watch()
    {
        return $this->belongsTo(Watch::class);
    }

    /**
     * Scope a query to only include platforms of a given name.
     */
    public function scopeOfName($query, $name)
    {
        return $query->where('name', $name);
    }

    /**
     * Scope a query to only include platforms for a given watch ID.
     */
    public function scopeForWatch($query, $watchId)
    {
        return $query->where('watch_id', $watchId);
    }
}
