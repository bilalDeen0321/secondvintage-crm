<?php

namespace App\Observers;

use App\Models\Watch;
use Illuminate\Support\Facades\Auth;

class WatchObserver
{
    /**
     * Handle the watch is creating
     */
    public function creating(Watch $watch)
    {
        if (empty($watch->user_id) && Auth::check()) {
            $watch->user_id = Auth::id();
        }

        // Ensure SKU is generated if not provided
        if (empty($watch->sku) && $watch->name && $watch->brand) {
            $brand_name = $watch->brand?->name ?? $watch->brand;
            $watch->sku = generateSKU($brand_name, $watch->name, Watch::class);
        }
    }
    /**
     * Handle the Watch "created" event.
     */
    public function created(Watch $watch): void
    {
        //
    }

    /**
     * Handle the Watch "updating" event.
     */
    public function updating(Watch $watch)
    {
        // If name or brand changes → regenerate SKU
        if (
            ($watch->isDirty('name') || $watch->isDirty('brand_id')) &&
            $watch->name &&
            $watch->brand
        ) {
            $brand_name = $watch->brand?->name ?? $watch->brand;
            $watch->sku = Watch::generateSKU($brand_name, $watch->name, Watch::class);
        }
    }

    /**
     * Handle the Watch "updated" event.
     */
    public function updated(Watch $watch): void
    {
        //
    }

    /**
     * Handle the Watch "deleted" event.
     */
    public function deleted(Watch $watch): void
    {
        //
    }

    /**
     * Handle the Watch "restored" event.
     */
    public function restored(Watch $watch): void
    {
        //
    }

    /**
     * Handle the Watch "force deleted" event.
     */
    public function forceDeleted(Watch $watch): void
    {
        //
    }
}
