<?php

namespace Database\Factories;

use App\Models\Watch;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\WatchLog>
 */
class WatchLogFactory extends Factory
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
            'action' => fake()->randomElement(['created', 'updated', 'status_changed', 'image_uploaded']),
            'details' => fake()->paragraph,
        ];
    }
}
