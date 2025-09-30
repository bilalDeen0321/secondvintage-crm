<?php

use App\Models\Watch;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

Route::get('/check-sku', function (Request $request) {
    $sku = $request->query('sku');

    if (!$sku) {
        return response()->json(['redirect' => "https://secondvintage.com/404"]);
    }

    $watch = Watch::where('sku', $sku)->first();

    if (!$watch) {
        return response()->json(['redirect' => "https://secondvintage.com/404"]);
    }

    if (strtolower($watch->status) === 'sold') {
        return response()->json([
            'redirect' => "https://secondvintage.com/thankyou/{$sku}",
            'data'     => $watch
        ]);
    }

    return response()->json([
        'redirect' => "https://secondvintage.com/watches/{$sku}",
        'data'     => $watch
    ]);
});
