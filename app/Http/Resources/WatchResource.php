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
            'brand' => $this->brand->name,
            'status' => $this->status->name,
            'location' => $this->location->name,
            'images' => WatchImageResource::collection($this->images()->orderBy('order')->get()),
        ];
    }
}
