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
            'id' => (string) $this->id,
            'name' => $this->name,
            'sku' => $this->sku,
            'brand' => optional($this->brand)->name,
            'acquisitionCost' => $this->original_cost,
            'status' => optional($this->status)->name,
            'location' => optional($this->location)->name,
            'batchGroup' => optional($this->batch)->batch_code ?? optional($this->batch)->name,
            'serial' => $this->serial_number,
            'ref' => $this->reference,
            'caseSize' => $this->case_size,
            'caliber' => $this->caliber,
            'timegrapher' => $this->timegrapher,
            'aiInstructions' => $this->ai_instructions ?? '',
            'notes' => $this->notes ?? '',
            'description' => $this->description,
            'images' => WatchImageResource::collection($this->images()->orderBy('order')->get()),
        ];
    }
}
