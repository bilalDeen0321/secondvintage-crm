<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;
use App\Models\{User, Brand};

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Wishlist>
 */
class WishlistFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'user_id' => User::factory(),
            'brand_id' => Brand::factory(),
            'name' => fake()->sentence(2),
            'price_range_min' => 1000,
            'price_range_max' => 3000,
            'currency' => fake()->currencyCode,
            'image_url' => fake()->imageUrl(),
        ];
    }
}
