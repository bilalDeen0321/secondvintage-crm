<?php

namespace App\Actions\Watch;

use App\Models\Batch;
use App\Models\Brand;
use App\Models\Watch;
use App\Models\WatchImage;
use Illuminate\Support\Arr;

class UpdateOrCreateAction
{
    /**
     * Invoke the action to update or create watch.
     */
    public function __invoke(array $attributes, array $values = [])
    {

        if (isset($values['batch'])) {
            $values['batch_id'] = Batch::firstOrCreate(['name' => $values['batch']])->id;
        }

        if (isset($values['brand'])) {
            $values['brand_id'] = Brand::firstOrCreate(['name' => $values['brand']])->id;
        }

        if (empty($values['location'])) {
            unset($values['location']);
        }

        // 2. Create Watch
        $watch = Watch::query()->updateOrCreate($attributes, $values);

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
