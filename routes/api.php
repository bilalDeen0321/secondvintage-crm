<?php

use App\Http\Controllers\Api\MakeAiHookController;
use App\Http\Controllers\Api\WatchApiController;
use App\Http\Controllers\Api\WatchSkuController;
use Illuminate\Support\Facades\Route;

/**
 * Register all api routes
 */

Route::prefix('make-ai-hooks')->name('make-ai-hooks.')->group(function () {
    Route::post('description/{watch}', [MakeAiHookController::class, 'description'])->name('description');
});

Route::prefix('watches')->name('watches.')->group(function () {
    Route::post('generate-sku', [WatchSkuController::class, 'generate'])->name('generate-sku');
});
