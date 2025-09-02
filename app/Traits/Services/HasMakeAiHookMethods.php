<?php

namespace App\Traits\Services;

use App\Models\Status;

trait HasMakeAiHookMethods
{
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
