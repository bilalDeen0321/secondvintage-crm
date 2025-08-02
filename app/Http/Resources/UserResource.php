<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class UserResource extends JsonResource
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
            'email' => $this->email,
            'role' => $this->getRoleNames()->first(), // assuming Spatie roles
            'status' => $this->status,
            'country' => $this->country,
            'currency' => $this->currency,
            'lastLogin' => optional($this->last_login_at)->format('Y-m-d H:i'),
            'joinDate' => optional($this->created_at)->format('Y-m-d'),
            'permissions' => $this->getPermissionsGrouped(),
        ];
    }
}
