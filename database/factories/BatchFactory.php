<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;
use App\Models\Watch;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Batch>
 */
class BatchFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'name' => 'Batch-' . fake()->numberBetween(1000, 9999),
            'tracking_number' => fake()->unique()->uuid,
            'origin' => fake()->country,
            'status' => fake()->randomElement(['shipped', 'pending', 'delivered', 'in_transit']),
            'notes' => fake()->paragraph,
            'shipped_date' => fake()->dateTime,
            'estimated_delivery' => fake()->date,
            'actual_delivery' => fake()->date,
            'destination' => fake()->randomElement(['Denmark', 'Sweden', 'Norway', 'Germany', 'USA']),
        ];
    }

    /**
     * Configure the model factory.
     */
    public function configure()
    {
        return $this->afterCreating(function ($batch) {
            // Create 1-5 watches for each batch
            $watchCount = fake()->numberBetween(1, 5);
            Watch::factory()
                ->count($watchCount)
                ->create(['batch_id' => $batch->id]);
        });
    }
}
