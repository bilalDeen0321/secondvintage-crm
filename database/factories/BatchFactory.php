<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;
use App\Models\{Location, Status, User};

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
            'name' => fake()->word,
            // 'location_id' => Location::factory(),
            // 'status' => Status::factory()->create()->name,
            // 'created_by' => User::factory(),
            'destination' => 'Denmark',
        ];
    }
}
