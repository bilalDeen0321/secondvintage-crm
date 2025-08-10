<?php

namespace Database\Seeders;

use App\Models\Brand;
use App\Models\Location;
use App\Models\Stage;
use App\Models\Status;
use App\Models\User;
use App\Models\Watch;
use App\Models\WatchImage;
use App\Support\Str;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class WatchSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $this->deomItems();
    }

    /**
     * Create static demo resouces
     */
    public static function deomItems()
    {

        $data = json_decode(file_get_contents(base_path('resources/data/watches.json')), true);

        foreach ($data as $item) {

            $location   = Location::query()->updateOrCreate(['name' => $item['location']]);
            $brand      = Brand::query()->updateOrCreate(['name' => $item['brand']]);
            $status     = Status::query()->updateOrCreate(['name' => Str::slug($item['status'])]);
            $user_id    = User::inRandomOrder()->first()?->id  ?? User::factory()->create()->id;


            $watch = Watch::query()->create([
                'sku'               => generateSKU($brand->name, $item['name'], Watch::class),
                'name'              => $item['name'],
                'brand_id'          => $brand->id,
                'user_id'           => $user_id,
                'stage_id'          => Stage::factory()->create()->id,
                'original_cost'     => $item['acquisitionCost'],
                'status_id'         => $status->id,
                'location_id'       => $location->id,
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
