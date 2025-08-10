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
    }
    /**
     * Handle the Watch "created" event.
     */
    public function created(Watch $watch): void
    {
        //
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
