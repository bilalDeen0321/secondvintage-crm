<?php

namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;

class WishlistResource extends JsonResource
{
    public function toArray($request)
    {
        return [
            'id'         => $this->id,
            'brand_id'      => $this->brand_id ?? '',
            'brand'         => $this->brand->name,
            'user_id'      => $this->user_id ?? '',
            'model'      => $this->model ?? '',
            'description'=> $this->description ?? '',
            'price_range_min'  => $this->price_range_min ?? 0,
            'price_range_max'  => $this->price_range_max ?? 0,
            'priority'   => $this->priority ?? 'Medium',
            'dateAdded'  => optional($this->created_at)->toDateString(),
            'image_url'      => $this->image_url ?? '/lovable-uploads/placeholder.png',
        ];
    }
}
