<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;
use Illuminate\Support\Facades\Storage;

class WatchImageResource extends JsonResource
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
            'url' => $this->url(),
            'order_index' => $this->order_index,
            'useForAI' => (bool) $this->use_for_ai, // or use another logic if you prefer
        ];
    }
}
