<?php

namespace App\Traits\Fakes;

use App\Enums\WatchAiStatus;
use App\Services\Api\MakeAiHook;
use Illuminate\Support\Facades\Http;

trait FakesMakeAiHook
{

    /**
     * Fake responses for MakeAiHook.
     *
     * @param  array<string, mixed>  $overrides
     * @return void
     */
    public static function fake(array $data = []): void
    {
        $hookUrl = config('services.make_hook.url');

        Http::fake([
            $hookUrl => function () use ($data) {

                // Apply user overrides
                $response = empty($data) ? self::fakeData() : $data;

                return Http::response($response, 200);
            },
        ]);
    }

    /**
     * Generate fake data
     */
    private static function fakeData(array $data = [])
    {
        $faker = fake();

        $status = $faker->randomElement([
            WatchAiStatus::success,
            WatchAiStatus::failed,
        ]);

        if ($status === WatchAiStatus::success) {
            return array_merge($data, [
                "Status"          => WatchAiStatus::success,
                "Message"         => 'Successfully generated',
                "Watch_ID"        => fake()->randomNumber(5),
                "Description"     => $faker->sentence(12),
                "Status_Selected" => "Review",
                "Thread_ID"       => "thread_" . fake()->uuid,
            ]);
        }

        return [
            "Status"          => WatchAiStatus::failed,
            "Message"         => 'Failed to generate description',
        ];
    }
}
