<?php

namespace Database\Seeders;

use App\Models\Watch;
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

        WatchSeeder::createDemoResoruces();
    }
}
