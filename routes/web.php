<?php

use App\Http\Controllers\ProfileController;
use App\Http\Controllers\Web\PreviewImageController;
use App\Http\Resources\UserResource;
use App\Http\Resources\WatchResource;
use App\Models\Batch;
use App\Models\Brand;
use App\Models\Location;
use App\Models\Status;
use App\Models\User;
use App\Models\Watch;
use App\Services\Api\MakeAiHook;
use Illuminate\Foundation\Application;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use Spatie\Permission\Models\Role;

// In routes/web.php
Route::get('/php-settings', function () {
    return [
        'upload_max_filesize' => ini_get('upload_max_filesize'),
        'post_max_size' => ini_get('post_max_size'),
        'max_execution_time' => ini_get('max_execution_time'),
        'memory_limit' => ini_get('memory_limit'),
        'loaded_ini' => php_ini_loaded_file(),
        'additional_ini' => php_ini_scanned_files(),
    ];
});

Route::name('web.')->group(function () {
    Route::get('preview-image', PreviewImageController::class)->name('preview-image');
});

Route::get('welcome', fn() => Inertia::render('Welcome', [
    'locations' => Location::query()->pluck('name')->unique()->values(),
    'statuses' => Status::query()->pluck('name')->unique()->values(),
    'batches' => Batch::query()->pluck('name')->unique()->values(),
    'brands' => Brand::query()->pluck('name')->unique()->values(),
]));
