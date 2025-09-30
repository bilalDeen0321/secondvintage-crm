<?php

namespace App\Filters;

use Illuminate\Http\Request;
use App\Models\Wishlist;

class WishlistFilter
{
    public static function apply(Request $request)
    {
        //dd(Wishlist::all()->toArray());
        $query = Wishlist::with('brand','user');

        if ($request->filled('search')) {
            $search = $request->search;

            $query->where(function ($q) use ($search) {
                $q->where('model', 'like', "%{$search}%")
                  ->orWhere('description', 'like', "%{$search}%")
                  ->orWhereHas('brand', function ($b) use ($search) {
                      $b->where('name', 'like', "%{$search}%");
                  });
            });
        }

        if ($request->filled('priority') && $request->priority !== 'all') {
            $query->where('priority', $request->priority);
        }

       if ($request->filled('budget') && $request->budget !== 'all') {
    switch ($request->budget) {
        case 'under250':
            $query->where('price_range_max', '<=', 250);
            break;

        case '250-500':
            $query->where(function($q) {
                $q->whereBetween('price_range_min', [250, 500])
                  ->orWhereBetween('price_range_max', [250, 500])
                  ->orWhere(function($q2) {
                      $q2->where('price_range_min', '<', 250)
                         ->where('price_range_max', '>', 500);
                  });
            });
            break;

        case '500-1000':
            $query->where(function($q) {
                $q->whereBetween('price_range_min', [500, 1000])
                  ->orWhereBetween('price_range_max', [500, 1000])
                  ->orWhere(function($q2) {
                      $q2->where('price_range_min', '<', 500)
                         ->where('price_range_max', '>', 1000);
                  });
            });
            break;

        case '1000-1500':
            $query->where(function($q) {
                $q->whereBetween('price_range_min', [1000, 1500])
                  ->orWhereBetween('price_range_max', [1000, 1500])
                  ->orWhere(function($q2) {
                      $q2->where('price_range_min', '<', 1000)
                         ->where('price_range_max', '>', 1500);
                  });
            });
            break;

        case '1500-2000':
            $query->where(function($q) {
                $q->whereBetween('price_range_min', [1500, 2000])
                  ->orWhereBetween('price_range_max', [1500, 2000])
                  ->orWhere(function($q2) {
                      $q2->where('price_range_min', '<', 1500)
                         ->where('price_range_max', '>', 2000);
                  });
            });
            break;

        case '2000-5000':
            $query->where(function($q) {
                $q->whereBetween('price_range_min', [2000, 5000])
                  ->orWhereBetween('price_range_max', [2000, 5000])
                  ->orWhere(function($q2) {
                      $q2->where('price_range_min', '<', 2000)
                         ->where('price_range_max', '>', 5000);
                  });
            });
            break;

        case 'over5000':
            $query->where(function($q) {
                $q->where('price_range_min', '>', 5000)
                   ->orWhere('price_range_max', '>', 5000);
            });
            break;
    }
}


        if ($request->filled('sortBy')) {
            switch ($request->sortBy) {
                case 'dateAdded':
                    $query->orderBy('created_at', 'desc');
                    break;
                case 'brand':
                    $query->orderBy('brand_id');
                    break;
                case 'budget':
                    $query->orderBy('price_range_max', 'desc');
                    break;
                case 'priority':
                    $query->orderBy('priority', 'asc');
                    break;
            }
        }

        return $query;
    }
}
