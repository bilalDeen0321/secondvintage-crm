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
        $public_url = $this->faker->randomElement($this->watchImagePool);

        // Extract filename from URL
        $filename = basename(parse_url($public_url, PHP_URL_PATH));

        return [
            'watch_id' => Watch::factory(),
            'filename' => $filename,
            'public_url' => 'https://placehold.co/600x600/png?text=Watch',
            'order' => $this->faker->numberBetween(1, 5),
        ];
    }


    private array $watchImagePool = [
        'https://images.pexels.com/photos/190819/pexels-photo-190819.jpeg',
        'https://images.pexels.com/photos/125779/pexels-photo-125779.jpeg',
        'https://images.pexels.com/photos/277319/pexels-photo-277319.jpeg',
        'https://images.pexels.com/photos/125779/pexels-photo-125779.jpeg',
        'https://images.pexels.com/photos/190819/pexels-photo-190819.jpeg',
    ];
}
