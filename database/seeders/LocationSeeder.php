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
        foreach (json_decode(file_get_contents(base_path('src/data/countries.json')), true) as $item) {
            Location::query()->updateOrCreate(
                [
                    'country_code' => $item['alpha2']
                ],
                [
                    'name' => $item['name']
                ]
            );
        }
    }
}
