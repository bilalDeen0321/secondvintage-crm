<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class SaleResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     */
    public function toArray(Request $request): array
    {
        return [
            'id'              => $this->id,
            'watchName'       => $this->watch?->name ?? $this->id,
            'platform'           => $this->watch?->platform,
            'sku'           => $this->watch?->sku,
            'buyer_country'           => $this->buyer_country,
            'original_price'             => $this->original_price,
            'currency'       => $this->currency,
            'buyer_name' => $this->buyer_name,
            'buyer_email'          => $this->buyer_email,
            'buyer_address'    => $this->buyer_address, 
            'buyer_city'        => $this->buyer_city,
            'buyer_postal_code'           => $this->buyer_postal_code,
            'country'         => $this->country, 
            'status'          => $this->watch?->status,
        ];
    }
}
