<?php

namespace App\Actions\Watch;

use App\Models\Batch;
use App\Models\Brand;
use App\Models\Location;
use App\Models\Watch;
use App\Models\WatchImage;
use Illuminate\Support\Arr;
use Illuminate\Support\Facades\DB;

class WatchUpsertForAi
{
    /**
     * Invoke the class instance.
     */
    public function __invoke(array $values = [], $routeKey = null)
    {
        return DB::transaction(function () use ($values, $routeKey) {

            if (isset($values['batch'])) {
                $values['batch_id'] = Batch::firstOrCreate(['name' => $values['batch']])->id;
            }

            if (isset($values['brand'])) {
                $values['brand_id'] = Brand::firstOrCreate(['name' => $values['brand']])->id;
            }

            if (empty($values['location'])) {
                $values['location'] = Location::DEFAULT_COUNTRY;
            }

            //get unique by SKU (route key)
            $attributes = [Watch::routeKeyName() => $routeKey ?? $values['sku'] ?? ''];

            $watch_data = Arr::except($values, ['sku', 'batch', 'brand', 'images']);

            // 2. Create Watch - Use SKU to avoid duplicate entries
            $watch = Watch::query()->updateOrCreate($attributes, $watch_data);

            // Handle update images
            if (!empty($values['images'])) {
                (new WatchImageSyncAction)($watch, $values['images']);
            }

            // $watch->refresh();

            return $watch;
        });
    }
}
