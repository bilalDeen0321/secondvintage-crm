<?php

namespace App\Actions\Watch;

use App\Models\Batch;
use App\Models\Brand;
use App\Models\Watch;
use App\Models\WatchImage;
use Illuminate\Support\Arr;

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
        $data =  Arr::only($input, Watch::instance()->getFillable());

        if (isset($data['brand'])) {
            $data['brand_id'] = Brand::firstOrCreate(['name' => $input['brand']]);;
        }

        if (isset($data['batch'])) {
            $data['batch_id'] = Batch::firstOrCreate(['name' => $data['batch']])->id;
        }


        // 3. Handle Base64 Images
        //clear images before store new images
        $watch->images()->getQuery()->delete();

        //save new images 
        if (!empty($data['images']) && is_array($data['images'])) {
            foreach ($data['images'] as $imageData) {
                if (!empty($imageData['url'])) {
                    WatchImage::storeBase64Image($watch, $imageData['url']);
                }
            }
        }

        return $watch->update($data);
    }
}
