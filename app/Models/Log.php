<?php

namespace App\Models;

use App\Traits\Models\ModelHelpers;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Auth;

class Log extends Model
{
    /** @use HasFactory<\Database\Factories\LogFactory> */
    use HasFactory, ModelHelpers;

    // Log level constants
    public const LEVEL_INFO    = 'info';
    public const LEVEL_SUCCESS = 'success';
    public const LEVEL_WARNING = 'warning';
    public const LEVEL_ERROR   = 'error';

    // Define constants for categories
    public const CATEGORY_WATCH_MANAGEMENT      = 'Watch Management';
    public const CATEGORY_SALES                 = 'Sales';
    public const CATEGORY_INVENTORY             = 'Inventory';
    public const CATEGORY_SYSTEM                = 'System';
    public const CATEGORY_BATCH_MANAGEMENT      = 'Batch Management';
    public const CATEGORY_AUTHENTICATION        = 'Authentication';
    public const CATEGORY_VENDOR_PAYMENTS       = 'Vendor Payments';
    public const CATEGORY_DATA_EXPORT           = 'Data Export';
    public const CATEGORY_PLATFORM_INTEGRATION  = 'Platform Integration';
    public const CATEGORY_AGENT_PAYMENTS        = 'Agent Payments';
    public const CATEGORY_USER_MANAGEMENT       = 'User Management';



    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'level',
        'category',
        'user_id',
        'message',
        'context',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'message' => 'string',
            'context' => 'array',
            'category' => 'string'
        ];
    }

    /**
     * Boot the model and attach event listeners.
     */
    protected static function boot()
    {
        parent::boot();

        static::creating(function ($log) {

            if (empty($log->user_id) && Auth::check()) {
                $log->user_id = Auth::id();
            }
            //
        });
    }

    /**
     * Return all categories
     */
    public static function categories(): array
    {
        return [
            self::CATEGORY_WATCH_MANAGEMENT,
            self::CATEGORY_SALES,
            self::CATEGORY_INVENTORY,
            self::CATEGORY_SYSTEM,
            self::CATEGORY_BATCH_MANAGEMENT,
            self::CATEGORY_AUTHENTICATION,
            self::CATEGORY_VENDOR_PAYMENTS,
            self::CATEGORY_DATA_EXPORT,
            self::CATEGORY_PLATFORM_INTEGRATION,
            self::CATEGORY_AGENT_PAYMENTS,
            self::CATEGORY_USER_MANAGEMENT,
        ];
    }


    /**
     * Map short keys to category constants.
     */
    public static function category(string $key = 'watch'): string
    {
        $maps = [
            'watch'        => self::CATEGORY_WATCH_MANAGEMENT,
            'sales'        => self::CATEGORY_SALES,
            'inventory'    => self::CATEGORY_INVENTORY,
            'system'       => self::CATEGORY_SYSTEM,
            'batch'        => self::CATEGORY_BATCH_MANAGEMENT,
            'auth'         => self::CATEGORY_AUTHENTICATION,
            'vendor'       => self::CATEGORY_VENDOR_PAYMENTS,
            'export'       => self::CATEGORY_DATA_EXPORT,
            'platform'     => self::CATEGORY_PLATFORM_INTEGRATION,
            'agent'        => self::CATEGORY_AGENT_PAYMENTS,
            'user'         => self::CATEGORY_USER_MANAGEMENT,
        ];

        return $maps[$key] ?? $key;
    }


    public function user()
    {
        return $this->belongsTo(User::class);
    }


    /**
     * Universal log method
     */
    public static function log(string $level, string $message, ?string $details = null, ?string $category = null): self
    {
        return self::create([
            'level'    => $level,
            'message'  => $message,
            'category' => self::category($category ?? 'watch'),
            'context'  => $details,
        ]);
    }


    /**
     * Create info log
     */
    public static function info(string $message, ?string $details = null, ?string $category = null): self
    {
        return self::log(self::LEVEL_INFO, $message, $details, $category);
    }

    /**
     * Create success log
     */
    public static function success(string $message, ?string $details = null, ?string $category = null): self
    {
        return self::log(self::LEVEL_SUCCESS, $message, $details, $category);
    }

    /**
     * Create warning log
     */
    public static function warning(string $message, ?string $details = null, ?string $category = null): self
    {
        return self::log(self::LEVEL_WARNING, $message, $details, $category);
    }

    /**
     * Create error log
     */
    public static function error(string $message, ?string $details = null, ?string $category = null): self
    {
        return self::log(self::LEVEL_ERROR, $message, $details, $category);
    }
}
