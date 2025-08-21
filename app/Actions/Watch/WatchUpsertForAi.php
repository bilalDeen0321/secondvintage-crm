<?php

namespace App\Actions\Watch;

use App\Models\Batch;
use App\Models\Brand;
use App\Models\Location;
use App\Models\Watch;
use App\Models\WatchImage;
use Illuminate\Support\Arr;

class WatchUpsertForAi
{
    /**
     * Invoke the class instance.
     */
    public function __invoke(array $values = [], $routeKey = null)
    {
        if (isset($values['batch'])) {
            $values['batch_id'] = Batch::firstOrCreate(['name' => $values['batch']])->id;
        }

        if (isset($values['brand'])) {
            $values['brand_id'] = Brand::firstOrCreate(['name' => $values['brand']])->id;
        }

        if (empty($input['location'])) {
            $values['location'] = Location::DEFAULT_COUNTRY;
        }

        // 2. Create Watch
        $watch = Watch::query()->updateOrCreate(
            [Watch::routeKeyName() => $routeKey],
            Arr::except($values, Watch::tableName())
        );

        // Handle images
        if (!empty($values['images'])) {
            foreach ($values['images'] as $img) {
                if (isset($img['file']) && $img['file'] instanceof \Illuminate\Http\UploadedFile) {
                    WatchImage::uploadImage($watch, $img['file'], $img['useForAI'] ?? false);
                }
            }
        }

        return $watch;
    }
}
