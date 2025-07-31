<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;
use App\Models\{User, Watch};

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Transaction>
 */
class TransactionFactory extends Factory
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
            'type' => fake()->randomElement(['payment', 'deposit']),
            'payment_type' => fake()->randomElement(['watches', 'shipping', 'watchmaker', 'fee', 'bonus']),
            'status' => fake()->randomElement(['unpaid', 'paid_not_received', 'refunded']),
            'amount' => fake()->randomFloat(2, 100, 1000),
            'currency' => fake()->currencyCode,
            'watch_id' => null, // optionally assigned
        ];
    }
}
