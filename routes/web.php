<?php

use App\Http\Controllers\Web\PreviewImageController;
use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\File;
use Illuminate\Support\Facades\Response;

/**
 * All web routes are defined in this file.
 * 
 * These routes are loaded by the app bootstrap within a group which
 */
Route::name('web.')->group(function () {
    Route::get('preview-image', PreviewImageController::class)->name('preview-image');
});

Route::name('testing.')->group(base_path('routes/testing.php'));
Route::get('/storage/{folder}/{subfolder}/{filename}', function ($folder, $subfolder, $filename) {
    $path = storage_path("app/public/{$folder}/{$subfolder}/{$filename}");

    if (!File::exists($path)) {
        abort(404);
    }

    $file = File::get($path);
    $type = File::mimeType($path);

    return Response::make($file, 200)->header("Content-Type", $type);
});