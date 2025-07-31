<?php

namespace Database\Factories;

use App\Models\Watch;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\WatchImage>
 */
class WatchImageFactory extends Factory
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
            'filename' => fake()->uuid . '.jpg',
            'public_url' => fake()->imageUrl(800, 600),
            'order' => fake()->numberBetween(1, 5),
        ];
    }
}
