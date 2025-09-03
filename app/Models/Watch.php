<?php

namespace App\Models;

use App\Observers\WatchObserver;
use App\Traits\Models\ModelHelpers;
use Illuminate\Database\Eloquent\Attributes\ObservedBy;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Storage;

#[ObservedBy(WatchObserver::class)]
class Watch extends Model
{
    /** @use HasFactory<\Database\Factories\WatchFactory> */
    use HasFactory, ModelHelpers;

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'sku',
        'name',
        'serial_number',
        'reference',
        'case_size',
        'caliber',
        'timegrapher',
        'original_cost',
        'current_cost',
        'currency',
        'status',
        'stage',

        'ai_instructions',
        'ai_thread_id',
        'ai_status',
        'ai_message',

        'notes',
        'description',

        'location',

        'seller_id',
        'agent_id',
        'brand_id',
        'user_id',
        'batch_id',
    ];

    /**
     * Scope a query to filter watches by status name (case insensitive).
     *
     * Usage: Watch::whereStatus('draft')->get();
     */
    public function scopeWhereStatus(Builder $query, string $status): Builder
    {
        return $query->whereHas('status', fn(Builder $q) => $q->where('name', $status));
    }

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'original_cost' => 'decimal:2',
            'current_cost'  => 'decimal:2',
        ];
    }

    /**
     * Append attributes
     */
    protected $appends = ['image_urls', 'ai_image_urls'];

    /**
     * get route key by slug
     */
    public function getRouteKeyName(): string
    {
        return 'sku';
    }

    /**
     * Boot the model and attach event listeners.
     */
    protected static function boot()
    {
        parent::boot();
    }

    /**
     * Get the user who owns this watch
     */
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Get the owner who owns this watch
     */
    public function created_by()
    {
        return $this->belongsTo(User::class);
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
    public function platforms()
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

    /**
     * Get the watch image URLs as absolute paths
     */
    public function getImageUrlsAttribute(): array
    {
        return $this->images->pluck('full_url')->all();
    }

    /**
     * Get ai images urls
     */
    public function getAiImageUrlsAttribute(): array
    {
        return optional($this->images)
            ->filter(fn($i) => $i->use_for_ai)
            ->pluck('full_url')
            ->all() ?? [];
    }
}
