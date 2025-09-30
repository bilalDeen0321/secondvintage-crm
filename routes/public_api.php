<?php

use App\Models\Watch;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

Route::get('/check-sku', function (Request $request) {
    $sku = $request->query('sku');

    $defaultUrl = "https://secondvintage.com/thankyou/{$sku}";

    if (!$sku) {
        return response()->json(['redirect' => $defaultUrl]);
    }

    $watch = Watch::where('sku', $sku)->first();
    
    if ($watch) {
        return response()->json(['redirect' => "https://secondvintage.com/watches/{$sku}", 'data' => $watch]);
    }

    return response()->json(['redirect' => $defaultUrl]);
});

Route::get('/ping', function () {
    return response()->json(['pong' => true]);
});