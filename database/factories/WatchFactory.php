<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;
use App\Models\{Brand, Status, Stage, Batch, Location, User, Watch};

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
        $name  = fake()->sentence(rand(2, 4));
        $brand = Brand::inRandomOrder()->first() ?? Brand::factory()->create();

        return [
            'name' => $name,
            'user_id' => User::inRandomOrder()->first()->id ?? User::factory()->create()->id,
            'brand_id' => $brand->id,
            'serial_number' => fake()->uuid,
            'reference' => strtoupper(fake()->bothify('REF-###')),
            'case_size' => fake()->numberBetween(34, 46) . 'mm',
            'caliber' => 'Caliber ' . fake()->randomDigitNotZero(),
            'timegrapher' => fake()->randomFloat(2, 0.1, 1.0),
            'original_cost' => fake()->randomFloat(2, 1000, 5000),
            'current_cost' => fake()->randomFloat(2, 500, 3000),
            'status' => fake()->randomElement(Status::allStatuses()),
            'stage' => fake()->randomElement(Stage::allStages()),
            'batch_id' => Batch::inRandomOrder()->first()->id ?? Batch::factory()->create()->id,
            'location' => fake()->country,
            'currency' => fake()->currencyCode,
            'agent_id' => User::inRandomOrder()->first()->id ?? User::factory()->create()->id,
            'seller_id' => User::inRandomOrder()->first()->id ?? User::factory()->create()->id,
            'description' => fake()->paragraph,
            'ai_thread_id' => fake()->uuid,
        ];
    }
}
