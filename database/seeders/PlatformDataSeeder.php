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

        Watch::query()->update(['platform' => null]);
        PlatformData::query()->delete();

        $data = json_decode(File::get(base_path('/resources/data/platform_data.json')), true);

        Watch::query()->get()->each(function (Watch $watch) use ($data) {

            foreach ($data as $item) {

                $status = fake()->randomElement([PlatformData::CATAWIKI,   PlatformData::TRADERA, null]);

                if ($status === $item['name']) {

                    $watch->update(['platform' => $status]);

                    $attributes = [
                        'watch_id' => $watch->id,
                        'name' => $item['name'],
                    ];

                    PlatformData::updateOrCreate(
                        $attributes,
                        [
                            'data' => $item['data'],
                            'status' => $status,
                        ]
                    );
                }
            }
        });
    }
}
