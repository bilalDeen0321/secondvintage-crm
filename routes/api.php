<?php

use App\Http\Controllers\Api\MakeAiHookController;
use App\Http\Controllers\Api\WatchApiController;
use App\Http\Controllers\Api\WatchSkuController;
use Illuminate\Support\Facades\Route;

/**
 * Register all api routes
 */

Route::prefix('hooks/ai-description')->name('make-hooks.ai-description.')->group(function () {
    Route::post('generate', [MakeAiHookController::class, 'generate'])->name('generate');
    Route::post('reset-thread', [MakeAiHookController::class, 'resetThread'])->name('reset_thread');
});

Route::prefix('watches')->name('watches.')->group(function () {
    Route::post('generate-sku', [WatchSkuController::class, 'generate'])->name('generate-sku');
});
