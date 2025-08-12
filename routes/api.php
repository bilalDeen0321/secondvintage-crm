<?php

use App\Http\Controllers\Api\MakeAiHookController;
use Illuminate\Support\Facades\Route;

/**
 * Register all api routes
 */

Route::prefix('make-ai-hooks')->name('make-ai-hooks.')->group(function () {
    Route::post('description/{watch}', [MakeAiHookController::class, 'description'])->name('description');
});
