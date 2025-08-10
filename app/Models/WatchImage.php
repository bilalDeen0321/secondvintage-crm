<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class WatchImage extends Model
{
    /** @use HasFactory<\Database\Factories\WatchImageFactory> */
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'watch_id',
        'filename',
        'public_url',
        'thumbnail',
        'order_index',
        'user_for_ai'
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

    public function watch()
    {
        return $this->belongsTo(Watch::class);
    }
}
