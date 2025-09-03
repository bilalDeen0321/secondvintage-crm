<?php

namespace App\Actions\Platform;

use App\Models\PlatformData;
use App\Models\Watch;

class WatchPlatformAction
{

    /**
     * Invoke the class instance.
     */
    public static function execute(Watch $watch, string $platformName): void
    {

        $platform = $watch->platforms()->firstOrCreate(['name' => $platformName]);

        // Update the specific platform status to loading
        $platform->update(['status' => PlatformData::STATUS_LOADING]);

        //updat the watch platform name
        $watch->update(['platform' => $platformName]);

        match ($platformName) {
            PlatformData::CATAWIKI => dispatch(new \App\Jobs\ProcessMakeHookCatawiki($watch, $platform)),
            PlatformData::TRADERA => dispatch(new \App\Jobs\ProcessMakeHookTradera($watch, $platform)),
            default => null,
        };
    }
}
