<?php

use App\Http\Controllers\Web\PreviewImageController;
use Illuminate\Support\Facades\Route;


/**
 * All web routes are defined in this file.
 * 
 * These routes are loaded by the app bootstrap within a group which
 */
Route::name('web.')->group(function () {
    Route::get('preview-image', PreviewImageController::class)->name('preview-image');
});

Route::name('testing.')->group(base_path('routes/testing.php'));
