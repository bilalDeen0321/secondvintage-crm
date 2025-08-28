<?php

namespace App\Services\Platform;

use App\Models\Watch;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Collection;

class TraderaService
{
    protected string $endpoint;
    protected ?string $apiKey;

    public function __construct()
    {
        $this->endpoint = config('services.tradera.endpoint');
        $this->apiKey   = config('services.tradera.key');
    }

    /**
     * Create a listing payload from a Watch model and send to Tradera.
     *
     * Returns a collection with response keys (Status, Message, etc).
     */
    public function createListingFromWatch(Watch $watch): Collection
    {
        try {
            $images = collect($watch->images ?? [])
                ->map(fn($i) => $i['url'] ?? $i->url ?? null)
                ->filter()
                ->values()
                ->all();

            $payload = [
                'Id'             => $watch->getKey(),
                'WatchName'      => $watch->name,
                'SKU'            => $watch->sku,
                'Brand'          => $watch->brand,
                'WatchSerial'    => $watch->serial_number ?? $watch->serial,
                'WatchRef'       => $watch->reference ?? $watch->reference_number,
                'WatchCaseSize'  => $watch->case_size ?? $watch->caseSize ?? null,
                'WatchCaliber'   => $watch->caliber ?? null,
                'WatchTimegrapher' => $watch->timegrapher ?? null,
                'Platform'       => 'Tradera',
                'imageUrls'      => $images, // Tradera expects image urls (adapt if semicolon-separated required)
                // add other fields as needed...
            ];

            $headers = ['Content-Type' => 'application/json'];
            if ($this->apiKey) {
                $headers['Authorization'] = "Bearer {$this->apiKey}";
            }

            $response = Http::withHeaders($headers)
                ->timeout(30)
                ->post($this->endpoint, $payload);

            Log::info('TraderaService payload', ['payload' => $payload, 'status' => $response->status()]);

            return collect($response->successful() ? $response->json() : [
                'Status' => 'error',
                'Message' => $response->body() ?: 'Unknown response from Tradera',
            ]);
        } catch (\Throwable $e) {
            Log::error('TraderaService error', ['exception' => $e]);
            return collect([
                'Status'  => 'error',
                'Message' => $e->getMessage(),
            ]);
        }
    }
}
