<?php

namespace App\Models;

use App\Packages\Utils\Traits\HasModelHelpers;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class TraderaSyncTime extends Model
{
    /** @use HasFactory<\Database\Factories\TraderaSyncTimeFactory> */
    use HasFactory, HasModelHelpers;

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'tst_sync_time',
        'close',
        'status',
    ];
}
