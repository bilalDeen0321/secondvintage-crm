<?php

use App\Http\Controllers\Api\LocationController;
use App\Http\Controllers\Api\MakeAiHookController;
use App\Http\Controllers\Api\WatchApiController;
use App\Http\Controllers\Api\WatchSkuController;
use App\Http\Resources\WatchResource;
use App\Models\Watch;
use Illuminate\Support\Facades\Route;
use Illuminate\Http\Request;

/**
 * Register all api routes
 */

Route::prefix('hooks/ai-description')->name('make-hooks.ai-description.')->group(function () {
    Route::post('generate', [MakeAiHookController::class, 'generate'])->name('generate');
    Route::post('with-queue', [MakeAiHookController::class, 'withQueue'])->name('with-queue');
    Route::post('reset-thread', [MakeAiHookController::class, 'resetThread'])->name('reset_thread');
});

Route::prefix('watches')->name('watches.')->group(function () {
    Route::get('/', fn() => WatchResource::collection(Watch::get()));
    Route::get('/{watch}/with-authors', [WatchApiController::class, 'withAuthors'])->name('with-authors');
    Route::post('generate-sku/{oldSku?}', [WatchSkuController::class, 'generate'])->name('generate-sku');
});

Route::resource('locations', LocationController::class);

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
