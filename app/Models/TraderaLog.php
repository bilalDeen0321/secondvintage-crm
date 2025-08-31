<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class TraderaLog extends Model
{
    use HasFactory;

    protected $fillable = [
        'action',
        'status',
        'watch_id',
        'user_id',
        'request_payload',
        'request_url',
        'request_headers',
        'response_data',
        'response_status',
        'response_body',
        'tradera_item_id',
        'tradera_order_id',
        'tradera_user_id',
        'tradera_token',
        'error_message',
        'error_details',
        'started_at',
        'completed_at',
        'duration_ms',
        'ip_address',
        'user_agent',
        'metadata'
    ];

    protected $casts = [
        'request_payload' => 'array',
        'request_headers' => 'array',
        'response_data' => 'array',
        'error_details' => 'array',
        'metadata' => 'array',
        'started_at' => 'datetime',
        'completed_at' => 'datetime'
    ];

    // Constants for actions
    const ACTION_CREATE_LISTING = 'create_listing';
    const ACTION_SYNC_ORDERS = 'sync_orders';
    const ACTION_AUTH_REQUEST = 'auth_request';
    const ACTION_AUTH_CALLBACK = 'auth_callback';
    const ACTION_GET_AUTH_URL = 'get_auth_url';

    // Constants for status
    const STATUS_PENDING = 'pending';
    const STATUS_SUCCESS = 'success';
    const STATUS_ERROR = 'error';
    const STATUS_TIMEOUT = 'timeout';

    /**
     * Relationships
     */
    public function watch(): BelongsTo
    {
        return $this->belongsTo(Watch::class);
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Scopes
     */
    public function scopeByAction($query, string $action)
    {
        return $query->where('action', $action);
    }

    public function scopeByStatus($query, string $status)
    {
        return $query->where('status', $status);
    }

    public function scopeSuccessful($query)
    {
        return $query->where('status', self::STATUS_SUCCESS);
    }

    public function scopeFailed($query)
    {
        return $query->where('status', self::STATUS_ERROR);
    }

    public function scopeRecent($query, int $days = 7)
    {
        return $query->where('created_at', '>=', now()->subDays($days));
    }

    /**
     * Helper methods
     */
    public function isSuccessful(): bool
    {
        return $this->status === self::STATUS_SUCCESS;
    }

    public function isFailed(): bool
    {
        return $this->status === self::STATUS_ERROR;
    }

    public function getDurationInSeconds(): ?float
    {
        return $this->duration_ms ? $this->duration_ms / 1000 : null;
    }
}
