<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Currency>
 */
class CurrencyFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {

        $name = $this->faker->unique()->currencyCode; // e.g., USD, EUR

        $symbols = [
            'USD' => '$',
            'EUR' => '€',
            'GBP' => '£',
            'JPY' => '¥',
            'CHF' => 'CHF',
            'AUD' => 'A$',
            'CAD' => 'C$',
            'CNY' => '¥',
            'INR' => '₹'
        ];

        return [
            'name'   => $name,
            'code'   => $name, // usually code is the same as currency code
            'symbol' => $symbols[$name] ?? $this->faker->randomElement(['$', '€', '£', '¥']),
            'rate'   => $this->faker->randomFloat(4, 0.01, 5000), // random exchange rate
        ];
    }
}
