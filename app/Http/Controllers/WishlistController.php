<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreWishlistRequest;
use App\Http\Requests\UpdateWishlistRequest;
use App\Models\Wishlist;
use App\Models\Brand;
use Inertia\Inertia;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Auth;
use Illuminate\Http\Request;
use App\Filters\WishlistFilter;
use App\Queries\WishlistQuery;
use App\Services\FileUploadService;
use App\Http\Resources\WishlistResource; 

class WishlistController extends Controller
{
    /**
     * Create a new controller instance.
     */
    public function __construct()
    {
        $this->middleware('permission:wishList');
    }

    /**
     * Display a listing of the resource.
     */
        public function index(Request $request)
        {
             $query = WishlistFilter::apply($request); 
             $wishlist = $query->get();
              return Inertia::render('WishList', [
                'wishlist' => WishlistResource::collection($wishlist),
                'brands'   => Brand::all(),
            ]);
                 
        }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreWishlistRequest $request, WishlistQuery $query)
    {    
    
        $wishlist  =$query->create($request->validated(), $request->file('image'));
        $wishlist_data  = new WishlistResource($wishlist->fresh());
            return response()->json([
                'message' => 'Wishlist item created successfully',
                'item' => $wishlist_data,
            ], 200);
     } 

    /**
     * Display the specified resource.
     */
    public function show(Wishlist $wishlist)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Wishlist $wishlist)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateWishlistRequest $request, Wishlist $wishlist)
    {
       
         $data = $request->validated();
 
    // Handle image if uploaded
        if ($request->hasFile('image')) {
            $old = $wishlist->getRawOriginal('image'); // raw DB value
            FileUploadService::delete($old);

            $data['image_url'] = FileUploadService::upload($request->image, 'wishlist_images');
        }
    $wishlist->update($data);

    return response()->json([
        'message' => 'Wishlist item updated successfully',
        'item' => new WishlistResource($wishlist->fresh(['brand', 'user']))
    ], 200);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy($id)
        {
            $wishlist = Wishlist::findOrFail($id);
             $old = $wishlist->getRawOriginal('image_url'); // raw DB value
            FileUploadService::delete($old);
            $wishlist->delete();
            return response()->json(['message' => 'Wishlist item deleted successfully']);
        }
}
