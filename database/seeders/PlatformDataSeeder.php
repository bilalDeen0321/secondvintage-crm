<?php

namespace Database\Seeders;

use App\Models\PlatformData;
use App\Models\Watch;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\File;

class PlatformDataSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {

        $data = json_decode(File::get(base_path('/resources/data/platform_data.json')), true);

        Watch::query()->get()->each(function (Watch $watch) use ($data) {
            foreach ($data as $item) {
                PlatformData::updateOrCreate(
                    [
                        'watch_id' => $watch->id,
                        'name' => $item['name'],
                    ],
                    [
                        'data' => $item['data'],
                        'status' => PlatformData::STATUS_REVIEW,
                    ]
                );
            }

            $watch->update(['platform' => fake()->randomElement(PlatformData::PLATFORMS)]);
        });
    }
}
