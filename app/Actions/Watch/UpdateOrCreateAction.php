<?php

namespace App\Actions\Watch;

use App\Models\Batch;
use App\Models\Brand;
use App\Models\Location;
use App\Models\Watch;
use App\Models\WatchImage;
use Illuminate\Support\Arr;
use Illuminate\Support\Facades\DB;

class UpdateOrCreateAction
{
    /**
     * Invoke the action to update or create watch.
     */
    public function __invoke(array $attributes, array $values = [], $routeKey = null)
    {
        return DB::transaction(function () use ($attributes, $values, $routeKey) {

            if (isset($values['batch'])) {
                $values['batch_id'] = Batch::firstOrCreate(['name' => $values['batch']])->id;
            }

            if (isset($values['brand'])) {
                $values['brand_id'] = Brand::firstOrCreate(['name' => $values['brand']])->id;
            }

            if (empty($input['location'])) {
                $data['location'] = Location::DEFAULT_COUNTRY;
            }

            // 2. Create Watch
            $watch = Watch::query()->updateOrCreate($attributes, $values);

            // Handle update images
            if (!empty($values['images'])) {

                (new WatchImageSyncAction)($watch, $values['images']);
            }

            return $watch;
        });
    }
}
