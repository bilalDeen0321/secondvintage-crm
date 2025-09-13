<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Status extends Model
{
    /** @use HasFactory<\Database\Factories\StatusFactory> */
    use HasFactory;

    // Define statuses as lowercase constants
    public const DRAFT = 'draft';
    public const REVIEW = 'review';
    public const APPROVED = 'approved';
    public const PLATFORM_REVIEW = 'platform_review';
    public const LISTING = 'ready_for_listing';
    public const LISTED = 'listed';
    public const RESERVED = 'reserved';
    public const SOLD = 'sold';
    public const PROBLEM = 'defect_problem';
    public const STANDBY = 'standby';

    // Optionally, a static method or property for all statuses:
    public static function allStatuses(): array
    {
        return [
            self::DRAFT,
            self::REVIEW,
            self::APPROVED,
            self::PLATFORM_REVIEW,
            self::LISTING,
            self::LISTED,
            self::RESERVED,
            self::SOLD,
            self::PROBLEM,
            self::STANDBY,
        ];
    }

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'name',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [];
    }

    /**
     * Convert external status string to internal database status.
     */
    public static function toDatabase(string $key): ?string
    {
        $statuses = [
            "Draft" => self::DRAFT,
            "Approved" => self::APPROVED,
            "Listed" => self::LISTED,
            "Ready for listing" => self::LISTING,
            "Review" => self::REVIEW,
            "Sold" => self::SOLD,
            "Reserved" => self::RESERVED,
            "Platform Review" => self::PLATFORM_REVIEW,
            "Standby" => self::STANDBY,
            "Defect/Problem" => self::PROBLEM,
        ];

        return $statuses[$key] ?? null; // return null if not found
    }

    /**
     * Get all watches that belong to this status.
     */
    public function watches(): HasMany
    {
        return $this->hasMany(Watch::class);
    }
}
