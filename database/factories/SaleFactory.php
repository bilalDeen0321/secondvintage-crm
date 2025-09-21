<?php

namespace Database\Factories;

use App\Models\User;
use App\Models\Watch;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Sale>
 */
class SaleFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'sold_by'            => User::inRandomOrder()->first()?->id ?? User::factory()->create()->id,
            'watch_id'           => Watch::inRandomOrder()->first()?->id ?? Watch::factory()->create()->id,
            'original_price'     => $this->faker->randomFloat(2, 2000, 20000),
            'currency'           => $this->faker->randomElement(['EUR','USD','GBP','CHF']),
            'price'              => $this->faker->randomFloat(2, 2500, 30000),
            'buyer_name'         => $this->faker->name,
            'buyer_email'        => $this->faker->safeEmail,
            'buyer_address'      => $this->faker->address,
            'buyer_city'         => $this->faker->city,
            'buyer_country'      => $this->faker->country,
            'buyer_postal_code'  => $this->faker->postcode,
            'buyer_iso_code'     => $this->faker->countryISOAlpha3,
            'condition'          => $this->faker->randomElement(['New', 'Mint', 'Good', 'Fair']),
            'gender'             => $this->faker->randomElement(['Men', 'Women', 'Unisex']),
            'movement'           => $this->faker->randomElement(['Automatic', 'Manual', 'Quartz']),
            'case_material'      => $this->faker->randomElement(['Steel', 'Gold', 'Titanium', 'Platinum']),
            'dial_color'         => $this->faker->safeColorName,
            'original_box'       => $this->faker->boolean(70),
            'original_papers'    => $this->faker->boolean(60),
            'original_warranty'  => $this->faker->boolean(50),
            'working_order'      => true,
            'repainted_dial'     => $this->faker->boolean(10),
            'created_at'         => $this->faker->dateTimeBetween('-8 months', 'now'),
            'updated_at'         => now(),
        ];
    }
}
