<?php

namespace App\Queries;

use App\Models\Wishlist;
use Illuminate\Http\UploadedFile;
use App\Filters\WishlistFilter;
use Illuminate\Support\Facades\Auth;

class WishlistQuery
{

    /**
     * Create a new wishlist item with optional image.
     */
    public function create(array $data, ?UploadedFile $image = null): Wishlist
    {
        $data['user_id'] = Auth::id();

        if ($image) {
            $path = $image->store('wishlist_images', 'public');
            $data['image_url'] = asset('storage/' . $path);
        }  
        return Wishlist::create($data); 
    }
}
