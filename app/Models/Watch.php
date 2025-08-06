<?php

namespace App\Models;

use App\Support\Sku;
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

    /**
     * get route key by slug
     */
    public function getRouteKeyName(): string
    {
        return 'slug';
    }

    /**
     * Boot the model and attach event listeners.
     */
    protected static function boot()
    {
        parent::boot();

        // static::creating(function (self $model) {});
    }


    /**
     * Get the brand for this watch
     */
    public function brand()
    {
        return $this->belongsTo(Brand::class);
    }

    /**
     * Get the status for this watch
     */
    public function status()
    {
        return $this->belongsTo(Status::class);
    }

    /**
     * Get the stage for this watch
     */
    public function stage()
    {
        return $this->belongsTo(Stage::class);
    }

    /**
     * Get the batch for this watch
     */
    public function batch()
    {
        return $this->belongsTo(Batch::class);
    }

    /**
     * Get the location for this watch
     */
    public function location()
    {
        return $this->belongsTo(Location::class);
    }

    /**
     * Get the agent for this watch
     */
    public function agent()
    {
        return $this->belongsTo(User::class, 'agent_id');
    }

    /**
     * Get the seller for this watch
     */
    public function seller()
    {
        return $this->belongsTo(User::class, 'seller_id');
    }

    /**
     * Get the images for this model
     */
    public function images()
    {
        return $this->hasMany(WatchImage::class);
    }

    /**
     * Get the logs for this model
     */
    public function logs()
    {
        return $this->hasMany(WatchLog::class);
    }

    /**
     * Get the platform data for this model
     */
    public function platformData()
    {
        return $this->hasMany(PlatformData::class);
    }

    /**
     * Get the transactions for this model
     */
    public function transactions()
    {
        return $this->hasMany(Transaction::class);
    }
}
