<?php

namespace Database\Seeders;

use App\Models\Location;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class LocationSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $locations = [
            "Denmark",
            "Vietnam",
            "Japan",
            "In Transit"
        ];

        foreach ($locations as $location) {
            Location::query()->updateOrCreate(['name' => $location]);
        }
    }
}
