<?php

namespace Database\Seeders;

use App\Models\Brand;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class BrandSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        foreach ($this->items() as $name) {
            Brand::query()->updateOrCreate(['name' => $name]);
        }
    }

    /**
     * 
     */
    public function items()
    {
        return [
            "Seiko",
            "Rolex",
            "Omega",
            "TAG Heuer",
            "Breitling",
            "IWC",
            "Seiko",
            "Tudor",
            "Cartier",
            "Longines",
            "Omega",
            "Seiko",
            "Longines",
            "Omega",
            "Seiko",
            "Longines",
            "Omega",
            "Seiko",
            "Longines"
        ];
    }
}
