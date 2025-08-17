<?php

namespace App\Services\Api;

use App\Models\Log;
use App\Models\Status;
use Illuminate\Support\Facades\Http;

class MakeAiHook
{
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
     * Create a new static instance
     */
    public static function init()
    {
        return app(static::class);
    }


    /**
     * Send a request to make.com to generate a watch descriptoin.
     */
    public function generateDescription(array $payload = [])
    {

        try {

            $response = Http::timeout(30) // Make.com can take a while with images
                ->asJson() // sets Content-Type: application/json and encodes payload
                ->withHeaders([
                    'x-make-apikey' => $this->apiKey,
                ])
                ->post($this->hookUrl, $payload);


            //send back
            return $response->collect();
        } catch (\Throwable $e) {
            return collect([
                'Status' => 'error',
                'Message'   => $e->getMessage(),
            ]);
        }
    }

    /**
     * Format the payload from the provided data.
     *
     * @param  array|object  $data
     * @return array
     */
    protected function getPayload(array $atrributes = []): array
    {
        if (is_object($atrributes) && method_exists($atrributes, 'toArray')) {
            $atrributes = $atrributes->toArray();
        }

        $payload = [
            'AI_Action'        => 'generate_description',
            'SKU'              => $data['sku'] ?? null,
            'Name'             => $data['name'] ?? null,
            'Brand'            => $data['brand'] ?? null, // brand_id in your list
            'Serial'           => $data['serial_number'] ?? null,
            'Ref'              => $data['reference'] ?? null,
            'Case_Size'        => $data['case_size'] ?? null,
            'Caliber'          => $data['caliber'] ?? null,
            'Timegrapher'      => $data['timegrapher'] ?? null,
            'Image_URLs'       => $data['image_urls'] ?? null, // not in your list, keep as-is
            'Platform'         => $data['platform'] ?? null,   // not in your list, keep as-is
            'Status_Selected'  => $data['status'] ?? Status::DRAFT,
            'AI_Instruction'   => $data['ai_instructions'] ?? null, // plural in your list
            'Thread_ID'        => $data['ai_thread_id'] ?? null,
        ];

        return array_filter($payload, fn($value) => $value !== null);
    }
}
