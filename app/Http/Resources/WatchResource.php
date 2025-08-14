<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class WatchResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            ...$this->resource->toArray(),
            'routeKey' => $this->getRouteKey(),
            'brand' => $this->brand->name,
            'batch' => $this->batch?->name ?? null,
            'status' => $this->status,
            'location' => $this->location,
            'images' => WatchImageResource::collection($this->images()->orderBy('order_index')->get()),
        ];
    }
}
