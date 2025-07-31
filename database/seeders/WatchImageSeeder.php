<?php

namespace Database\Seeders;

use App\Models\Watch;
use App\Models\WatchImage;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class WatchImageSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        Watch::all()->each(function ($watch) {
            WatchImage::factory()->count(rand(1, 4))->create([
                'watch_id' => $watch->id,
            ]);
        });
    }
}
