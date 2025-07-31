<?php

namespace Database\Seeders;

use App\Models\Watch;
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
}
