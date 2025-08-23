<?php

namespace App\Actions\Watch;

use App\Models\Batch;
use App\Models\Brand;
use App\Models\Location;
use App\Models\Watch;
use App\Models\WatchImage;
use Illuminate\Support\Arr;
use Illuminate\Support\Facades\DB;

class UpdateWatchAction
{
    /**
     * Create a new class instance.
     */
    public function __construct()
    {
        //
    }

    /**
     * Invoke the class instance.
     */
    public function __invoke(Watch $watch,  array $input)
    {

        return DB::transaction(function () use ($watch, $input) {

            $data =  $input;

            if (isset($input['batch'])) {
                $data['batch_id'] = Batch::firstOrCreate(['name' => $input['batch']])->id;
            }

            if (isset($input['brand'])) {
                $data['brand_id'] = Brand::firstOrCreate(['name' => $input['brand']])->id;
            }

            if (empty($input['location'])) {
                $data['location'] = Location::DEFAULT_COUNTRY;
            }

            // 2. Create Watch
            if (!$watch->update(Arr::only($data, Watch::fields()))) {
                throw new \Exception('Failed to update watch');
            }

            // refresh the watch instance
            $watch->refresh();

            // Handle update images
            if (!empty($input['images'])) {

                (new WatchImageSyncAction)($watch, $input['images']);
            }

            return $watch;
        });
    }
}
