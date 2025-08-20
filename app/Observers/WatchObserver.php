<?php

namespace App\Observers;

use App\Models\Brand;
use App\Models\Watch;
use App\Support\Str;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;

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

        $nameChanged = $watch->isDirty('name');
        $brandChanged = $watch->isDirty('brand_id');

        // Check if brand name changed only if the brand relation is loaded
        $brandNameChanged = false;
        if (!$brandChanged && $watch->relationLoaded('brand')) {
            $brandNameChanged = $watch->brand->isDirty('name');
        }

        if ($nameChanged || $brandChanged || $brandNameChanged) {
            $brandName = $watch->brand?->name ?? '';
            $watch->slug = generateSKU($brandName, $watch->name, Watch::class);
        }
    }

    /**
     * Handle the Watch "deleting" event.
     */
    public function deleting(Watch $watch): void
    {
        // Example: Delete associated images BEFORE the watch is deleted
        if ($watch->images) {
            foreach ($watch->images as $image) {

                //remove file from storage
                if (Storage::disk('public')->exists($image?->public_url ?? '')) {
                    Storage::disk('public')->delete($image->public_url);
                }

                //delete the image record if exists
                if ($image instanceof \App\Models\WatchImage) {
                    $image->delete();
                }
            }
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
