<?php

namespace Database\Seeders;

use App\Models\Brand;
use App\Models\Location;
use App\Models\Stage;
use App\Models\Status;
use App\Models\Watch;
use App\Models\WatchImage;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class WatchSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        Watch::factory()->count(50)->create();
    }

    /**
     * Create static demo resouces
     */
    public static function createDemoResoruces()
    {

        $data = json_decode(file_get_contents(base_path('resources/data/watches.json')), true);

        foreach ($data as $item) {

            $brand = Brand::query()->updateOrCreate(
                [
                    'name' => $item['brand'],
                ],
                [
                    'brand_code' => strtoupper(fake()->unique()->lexify('???'))
                ],
            );

            $watch = Watch::query()->create([
                'sku'               => generateSKU($brand->name, $item['name'], Watch::class),
                'name'              => $item['name'],
                'brand_id'          => $brand->id,
                'stage_id'          => Stage::factory()->create()->id,
                'original_cost'     => $item['acquisitionCost'],
                'status_id'         => Status::query()->create(['name' => $item['status']])->id,
                'location_id'       => Location::query()->create(['name' => $item['location']])->id,
                'description'       => $item['description'],
                'ai_instructions'   => $item['aiInstructions'],
                'notes'             => $item['notes'],
            ]);

            foreach ($item['images'] as $image) {
                WatchImage::query()->create([
                    'public_url' => $image['url'],
                    'filename'   => $watch->name,
                    'watch_id'   => $watch->id,
                    'use_for_ai' => $image['useForAI']
                ]);
            }
        }
    }
}
