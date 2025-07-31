<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Watch extends Model
{
    /** @use HasFactory<\Database\Factories\WatchFactory> */
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'sku',
        'name',
        'brand_id',
        'serial_number',
        'reference',
        'case_size',
        'caliber',
        'timegrapher',
        'original_cost',
        'current_cost',
        'status_id',
        'stage_id',
        'batch_id',
        'location_id',
        'agent_id',
        'seller_id',
        'description',
        'description_thread_id',
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
