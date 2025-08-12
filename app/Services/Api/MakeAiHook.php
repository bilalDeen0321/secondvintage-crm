<?php

namespace App\Services\Api;

use App\Models\Status;
use App\Models\Watch;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

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
     * Send a request to Make.com to generate a product description.
     *
     * @param Watch $watch  The watch data or a Watch model instance.
     */
    public function description(Watch $watch)
    {
        $payload = $this->payloadFromWatch($watch);

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
            Log::error('Make.com request exception', ['error' => $e->getMessage()]);
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
    protected function payloadFromWatch(Watch $watch, $Thread_ID = null): array
    {

        return [
            'AI_Action'        => 'generate_description',
            'Watch_ID'         => $watch->id ?? null,
            'SKU'              => $watch->sku ?? '',
            'Name'             => $watch->name ?? '',
            'Brand'            => $watch->brand->name ?? '',
            'Serial'           => $watch->serial_number ?? '',
            'Ref'              => $watch->reference ?? '',
            'Case_Size'        => $watch->case_size ?? '',
            'Caliber'          => $watch->caliber ?? '',
            'Timegrapher'      => $watch->timegrapher,
            'Image_URLs'       => app()->environment('local') ? [
                "https://i.imgur.com/Rq8NO58.jpeg",
                "https://i.imgur.com/NHn1Xq8.jpeg"
            ] :  $watch->image_urls,
            'Platform'         => $watch->platformData,
            'Status_Selected'  => $watch->status,
            'AI_Instruction'   => $watch->ai_instructions,
            // 'Thread_ID'        => null,
        ];
    }
    /**
     * Format the payload from the provided data.
     *
     * @param  array|object  $data
     * @return array
     */
    protected function formatPayload($data): array
    {
        if (is_object($data) && method_exists($data, 'toArray')) {
            $data = $data->toArray();
        }

        return [
            'AI_Action'        => 'generate_description',
            'Watch_ID'         => $data['id'] ?? null,
            'SKU'              => $data['sku'] ?? '',
            'Name'             => $data['name'] ?? '',
            'Brand'            => $data['brand'] ?? '',
            'Serial'           => $data['serial'] ?? '',
            'Ref'              => $data['ref'] ?? '',
            'Case_Size'        => $data['case_size'] ?? '',
            'Caliber'          => $data['caliber'] ?? '',
            'Timegrapher'      => $data['timegrapher'] ?? '',
            'Image_URLs'       => $data['image_urls'] ?? [],
            'Platform'         => $data['platform'] ?? '',
            'Status_Selected'  => $data['status'] ?? Status::DRAFT,
            'AI_Instruction'   => $data['ai_instruction'] ?? '',
            'Thread_ID'        => $data['ai_thread_id'] ?? '',
        ];
    }
}
