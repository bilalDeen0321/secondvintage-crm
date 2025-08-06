<?php

namespace Database\Seeders;

use App\Models\Log;
use App\Models\Watch;
use App\Models\WatchImage;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class HelperSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        Watch::query()->delete();

        /** @var \Illuminate\Database\Eloquent\Collection<int, \App\Models\Watch> $watches */
        $watches = Watch::factory(10)->create();

        foreach ($watches as $watch) {
            WatchImage::factory(rand(1, 6))->create(['watch_id' => $watch->id]);
            Log::factory(rand(0, 10))->create(['user_id' => $watch->agent_id]);
        }
    }
}
