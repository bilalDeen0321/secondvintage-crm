<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Status extends Model
{
    /** @use HasFactory<\Database\Factories\StatusFactory> */
    use HasFactory;

    // Define statuses as lowercase constants
    public const DRAFT = 'draft';
    public const REVIEW = 'review';
    public const APPROVED = 'approved';
    public const PLATFORM_REVIEW = 'platform_review';
    public const READY_FOR_LISTING = 'ready_for_listing';
    public const LISTED = 'listed';
    public const RESERVED = 'reserved';
    public const SOLD = 'sold';
    public const DEFECT_PROBLEM = 'defect_problem';
    public const STANDBY = 'standby';

    // Optionally, a static method or property for all statuses:
    public static function allStatuses(): array
    {
        return [
            self::DRAFT,
            self::REVIEW,
            self::APPROVED,
            self::PLATFORM_REVIEW,
            self::READY_FOR_LISTING,
            self::LISTED,
            self::RESERVED,
            self::SOLD,
            self::DEFECT_PROBLEM,
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
}
