<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Carbon\Carbon;

class TraderaSyncTime extends Model
{
    protected $fillable = [
        'last_sync_time',
        'is_active'
    ];

    protected $casts = [
        'last_sync_time' => 'datetime',
        'is_active' => 'boolean'
    ];

    public static function getLastSyncTime(): Carbon
    {
        $record = self::where('is_active', true)->first();
        return $record ? $record->last_sync_time : now()->subDays(17);
    }

    public static function updateSyncTime(Carbon $time): void
    {
        self::where('is_active', true)->update([
            'last_sync_time' => $time
        ]);
    }
}
