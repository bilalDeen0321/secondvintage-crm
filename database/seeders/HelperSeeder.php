<?php

namespace Database\Seeders;

use App\Models\Watch;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Artisan;

class HelperSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Watch::query()->delete();

        // WatchSeeder::createDemoResoruces();

        Artisan::call('migrate:refresh', [
            '--path' => 'database/migrations/2025_07_31_023310_create_batches_table.php'
        ]);
    }
}
