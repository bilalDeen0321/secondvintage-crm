<?php

use App\Http\Controllers\Web\PreviewImageController;
use App\Mail\TestingEmail;
use App\Models\Batch;
use App\Models\Brand;
use App\Models\Currency;
use App\Models\Location;
use App\Models\Status;
use App\Models\Watch;
use Illuminate\Support\Facades\Artisan;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use Maatwebsite\Excel\Facades\Excel;

Route::get('test', function () {
    $filePath = base_path('/resources/data/csv/catawiki_values.csv');
    $data = Excel::toArray([], $filePath)[0];

    if (empty($data)) {
        return [];
    }

    $headers = array_shift($data); // Get first row as headers
    $result = [];

    // Initialize arrays for each header
    foreach ($headers as $header) {
        $result[$header] = [];
    }

    // Process each data row
    foreach ($data as $row) {
        // Map values to their respective header arrays
        foreach ($headers as $index => $header) {
            $value = $row[$index] ?? null;
            // Only add non-null values
            if ($value !== null) {
                $result[$header][] = $value;
            }
        }
    }

    return $result;
});

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


Route::prefix('testing')->group(function () {
    Route::get('email', fn() => Mail::to('appsaeed7@gmail.com')->send(new TestingEmail()) ? 'ok' : 'No');
    Route::get('listen', fn() => Inertia::render('testing/EventLestening'));
    // Route::get('schedule', ScheduleListening::class);
    Route::get('dispatch-event', fn() => event(new \App\Events\TestingEvent));
    Route::get('dispatch-job', fn() => tap(dispatch(new \App\Jobs\TestingJob)) ? 'dispatched!' : 'Failed');
});

Route::get('/clear', function () {

    Artisan::call('cache:clear');
    Artisan::call('config:clear');
    Artisan::call('config:cache');
    Artisan::call('view:clear');
    Artisan::call('optimize:clear');

    return "Cleared!";
});


Route::get('welcome', fn() => Inertia::render('Welcome', [
    'locations' => Location::query()->pluck('name')->unique()->values(),
    'statuses' => Status::query()->pluck('name')->unique()->values(),
    'batches' => Batch::query()->pluck('name')->unique()->values(),
    'brands' => Brand::query()->pluck('name')->unique()->values(),
]));
