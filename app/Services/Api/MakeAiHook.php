<?php

namespace App\Services\Api;

use App\Models\Log;
use App\Models\Status;
use App\Packages\Utils\Traits\CreateInstance;
use App\Traits\Fakes\FakesMakeAiHook;
use App\Traits\Services\HasMakeAIHookDemoData;
use Illuminate\Support\Facades\Http;

class MakeAiHook
{
    use FakesMakeAiHook, CreateInstance, HasMakeAIHookDemoData;

    protected string $hookUrl;
    protected string $apiKey;

    /**
     * Create a new class instance.
     */
    public function __construct()
    {
        $this->hookUrl = config('services.make_hook.url');
        $this->apiKey  = config('services.make_hook.key');
    }

    /**
     * Make the request to make.com webhook
     */
    private function request(array $payload): \Illuminate\Http\Client\Response
    {
        return Http::timeout(60)->asJson()
            ->withHeaders(['x-make-apikey' => $this->apiKey])
            ->post($this->hookUrl, $payload);
    }

    /**
     * Send a request to make.com to generate a watch descriptoin.
     */
    public function generateDescription(array $payload = [])
    {

        try {

            $response = $this->request($payload);

            Log::info(__METHOD__, $response->body());

            //send back
            return $response->collect()
                ->mapWithKeys(function ($value, $key) {
                    return [ucfirst($key) => $value];
                });
            //
        } catch (\Throwable $e) {
            return collect([
                'Status' => 'error',
                'Message'   => $e->getMessage(),
            ]);
        }
    }

    /**
     * Export watch item to Catawiki through make.com webhook
     */
    public function generateCatawikiData(array $payload = [])
    {
        try {
            // Set the AI_Action for Catawiki data generation
            $payload['AI_Action'] = 'generate_catawiki_data';
            $payload['Platform'] = 'Catawiki';

            $response = $this->request($payload);

            Log::info(__METHOD__, $response->body());

            // Send back response
            return $response->collect()
                ->mapWithKeys(fn($value, $key) => [ucfirst($key) => $value]);
        } catch (\Throwable $e) {
            return collect([
                'status' => 'error',
                'message' => $e->getMessage(),
            ]);
        }
    }
}
