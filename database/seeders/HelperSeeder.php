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
        //clear all watches platform  and platform data
        Watch::query()->update(['platform' => null]);
        Watch::query()->get()->each(function (Watch $watch) {
            $watch->platforms()->delete();
        });
    }
}
