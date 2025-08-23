<?php

namespace App\Actions\Watch;

use App\Models\Watch;
use App\Models\WatchImage;

class WatchImageSyncAction
{

    /**
     * Invoke the class instance.
     */
    public function __invoke(Watch $watch, array $images)
    {
        $image_ids = [];

        foreach ($images as $index => $img) {

            $use_for_ai = $img['useForAI'] ?? false;

            if (isset($img['file']) && $img['file'] instanceof \Illuminate\Http\UploadedFile) {

                $image_ids[] = WatchImage::upload($watch, $img['file'], $use_for_ai)->id;
            } elseif (isset($img['id'])) {

                $image_ids[] = $img['id'];

                $watch->images()->where('id', $img['id'])->update([
                    'use_for_ai' => $use_for_ai,
                    'order_index' => $index + 1,
                ]);
            }
        }

        $watch->images()->whereNotIn('id', $image_ids)->delete();

        // return $image_ids;
    }
}
