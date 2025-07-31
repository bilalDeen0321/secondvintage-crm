<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;
use App\Models\{Brand, Status, Stage, Batch, Location, User};

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Watch>
 */
class WatchFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'sku' => strtoupper(fake()->unique()->bothify('SKU-#####')),
            'name' => fake()->sentence(2),
            'brand_id' => Brand::factory(),
            'serial_number' => fake()->uuid,
            'reference' => strtoupper(fake()->bothify('REF-###')),
            'case_size' => fake()->numberBetween(34, 46) . 'mm',
            'caliber' => 'Caliber ' . fake()->randomDigitNotZero(),
            'timegrapher' => fake()->randomFloat(2, 0.1, 1.0),
            'original_cost' => fake()->randomFloat(2, 1000, 5000),
            'current_cost' => fake()->randomFloat(2, 500, 3000),
            'status_id' => Status::factory(),
            'stage_id' => Stage::factory(),
            'batch_id' => null, // can be set dynamically
            'location_id' => Location::factory(),
            'agent_id' => User::factory(),
            'seller_id' => User::factory(),
            'description' => fake()->paragraph,
            'description_thread_id' => fake()->uuid,
        ];
    }
}
