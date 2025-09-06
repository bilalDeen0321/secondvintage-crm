<?php

use App\Exports\CatawikiExport;
use App\Http\Controllers\Web\PreviewImageController;
use App\Mail\TestingEmail;
use App\Models\Batch;
use App\Models\Brand;
use App\Models\Currency;
use App\Models\Location;
use App\Models\PlatformData;
use App\Models\PlatformDataOption;
use App\Models\Status;
use App\Models\Watch;
use Illuminate\Support\Facades\Artisan;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use Maatwebsite\Excel\Facades\Excel;

/**
 * All web routes are defined in this file.
 * ===========================================
 * All blow routes are only for testing and development purposes.
 * They should be removed or disabled in production.
 */








Route::get('test', function () {

    $ids = Watch::query()->where('platform', PlatformData::CATAWIKI)->pluck('id')->toArray();

    // Generate filename with timestamp
    $filename = 'Catawiki_export_' . now()->format('Y-m-d') . '.csv';

    return Excel::download(new CatawikiExport($ids), $filename);;
});













///===================================================================================================
///===================================================================================================
///===================================================================================================
///===================================================================================================
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
