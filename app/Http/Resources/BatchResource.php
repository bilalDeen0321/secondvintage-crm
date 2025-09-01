<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class BatchResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'name' => $this->name,
            'trackingNumber' => $this->tracking_number,
            'origin' => $this->origin,
            'destination' => $this->destination,
            'status' => $this->status,
            'notes' => $this->notes,
            'shippedDate' => $this->shipped_date,
            'estimatedDelivery' => $this->estimated_delivery,
            'actualDelivery' => $this->actual_delivery,
            'watches' => WatchResource::collection($this->whenLoaded('watches')),
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
        ];
    }
}
