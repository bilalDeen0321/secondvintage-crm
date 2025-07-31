<?php

namespace Database\Seeders;

use App\Models\PlatformData;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class PlatformDataSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        PlatformData::factory()->count(20)->create();
    }
}
