<?php

namespace Database\Factories;

use App\Models\Watch;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\PlatformData>
 */
class PlatformDataFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'watch_id' => Watch::factory(),
            'platform' => fake()->randomElement(['Catawiki', 'Tradera', 'eBay', 'Chrono24']),
            'data' => [
                'listing_id' => fake()->uuid,
                'price' => fake()->randomFloat(2, 1000, 5000),
                'currency' => fake()->currencyCode,
            ],
            'status' => fake()->randomElement(['draft', 'listed', 'sold', 'removed']),
        ];
    }
}
