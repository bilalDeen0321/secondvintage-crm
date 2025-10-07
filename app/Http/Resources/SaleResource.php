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
        $originalPrice = $this->original_price;
        $salePrice = $this->price;
        $profit = $salePrice - $originalPrice;
        $margin = $salePrice > 0 ? round(($profit / $salePrice) * 100, 2) : 0;

        return [
            'id'              => $this->id,
            'watchName'       => $this->watch?->name ?? $this->id,
            'brand'       => $this->watch->brand ?->name,
            'sku'           => $this->watch?->sku,
            'original_price'             => $originalPrice,
            'sale_price'             => $salePrice,
            'profit'             =>  $profit,
            'margin'             => $margin,
            'created_at'           => $this->created_at->format('n/j/Y'),
            'platform'           => $this->watch?->platform?? '-',
            'buyer_name' => $this->buyer_name,            
            'country'         => $this->buyer_country,
            'status'          => $this->watch?->status,
        ];
    }
}
