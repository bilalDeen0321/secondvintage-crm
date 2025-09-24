<?php

namespace App\Queries;

use App\Models\Wishlist;
use Illuminate\Http\UploadedFile;
use App\Filters\WishlistFilter;
use Illuminate\Support\Facades\Auth;
use App\Services\FileUploadService;


class WishlistQuery
{

    /**
     * Create a new wishlist item with optional image.
     */
    public function create(array $data, ?UploadedFile $image = null): Wishlist
    {
        $data['user_id'] = Auth::id();

        if ($image) {
            $data['image_url'] = FileUploadService::upload($image, 'wishlist_images');
        }    
       $wishlist =  Wishlist::create($data);
       return $wishlist->fresh();
    }
}
