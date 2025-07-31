<?php

namespace Database\Seeders;

use App\Models\WatchLog;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class WatchLogSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        WatchLog::factory()->count(50)->create();
    }
}
