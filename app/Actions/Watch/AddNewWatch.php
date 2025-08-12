<?php

namespace App\Actions\Watch;

use App\Models\Batch;
use App\Models\Brand;
use App\Models\Location;
use App\Models\Watch;
use App\Models\WatchImage;

class AddNewWatch
{
    /**
     * Invoke the class instance.
     */
    public function __invoke($data)
    {
        $batch_id =  null;

        $brand = Brand::firstOrCreate(['name' => $data['brand']]);

        if (isset($data['batch'])) {
            $batch_id = Batch::firstOrCreate(['name' => $data['batch']])->id;
        }

        // 2. Create Watch
        $watch = Watch::query()->create([
            'sku'             => $data['sku'],
            'name'            => $data['name'],
            'serial_number'   => $data['serial_number'],
            'reference'       => $data['reference'],
            'case_size'       => $data['case_size'],
            'caliber'         => $data['caliber'],
            'timegrapher'     => $data['timegrapher'],
            'original_cost'   => $data['original_cost'],
            'current_cost'    => $data['current_cost'],
            'currency'        => $data['currency'],
            'description'     => $data['description'] ?? '',
            'notes'           => $data['notes'] ?? '',
            'ai_instructions' => $data['ai_instructions'] ?? '',
            'status'          => $data['status'],
            'location'        => $data['location'] ?? Location::DEFAULT_COUNTRY,
            'brand_id'        => $brand->id,
            'batch_id'        => $batch_id,
        ]);

        // 3. Handle Base64 Images
        if (!empty($data['images']) && is_array($data['images'])) {
            foreach ($data['images'] as $imageData) {
                if (!empty($imageData['url'])) {
                    WatchImage::storeBase64Image($watch, $imageData['url']);
                }
            }
        }

        return $watch;
    }
}
