<?php

use App\Http\Controllers\Api\LocationController;
use App\Http\Controllers\Api\MakeAiHookController;
use App\Http\Controllers\Api\WatchApiController;
use App\Http\Controllers\Api\WatchSkuController;
use Illuminate\Support\Facades\Route;
use App\Http\Resources\WatchResource;
use App\Models\Watch;

/**
 * Register all api routes
 */
// api.make-hooks.ai-description.reset_thread
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


Route::get('tested', function(){

    $watch = Watch::where('sku', 'BER-NNS-0001')->first();

    $payload = [
        'SKU'             => $watch->sku ?? null,
        'Name'            => $watch->name ?? null,
        'Brand'           => $watch?->brand?->name ?? null,
        'Serial'          => $watch->serial_number ?? null,
        'Ref'             => $watch->reference ?? null,
        'Case_Size'       => $watch->case_size ?? null,
        'Caliber'         => $watch->caliber ?? null,
        'Timegrapher'     => $watch->timegrapher ?? null,
        'Platform'        => 'Catawiki',
        'Description'     => $watch->description ?? null,
        'Status_Selected' => $watch->status ?? App\Models\Status::DRAFT,
        'Image_URLs'      => $watch->ai_image_urls,
    ];

        $payload = array_filter($payload, fn($v) => $v !== null);

        // dd($payload);

        // \Log::info("watch payload", json_encode($payload));

        // // if (app()->environment('local')) {
        // //     Sleep::for(10)->seconds();
        // //     $make = Collection::fromJson(File::get(base_path('resources/make.com/catawiki-response.json')));
        // // } else {
        // // }

        $make = App\Services\Api\MakeAiHook::init()->generateCatawikiData($payload);
        $data = App\Actions\Platform\ExtractMakeHookToCatawiki::execute($watch, $make);

        dd($make, $data, $make->get('Status_Selected'));
        // // $make = MakeAiHook::init()->generateCatawikiData($payload);

        // Log::info('make api call response: ', $make);

        // if ($make->get('Status') === 'success') {
        //     $this->handleSuccess($make);
        // } else {
        //     $this->handleFailure($make);
        // }
});


// Route::get('/fire-event/{watch}', function (Watch $watch) {

//     // dd($watch, request()->query('status'));
//     $watch->update([
//         'ai_description' => 'This is a test description from event',
//         'ai_status' => request()->query('status'),
//     ]);

//     event(new \App\Events\WatchAiDescriptionProcessedEvent($watch));
//     return response()->json(['status' => 'Event broadcasted!']);
// });

Route::get('/fire-event/{watch}', function (Watch $watch) {

    $platform = $watch->platforms()->firstOrCreate(['name' => 'catawiki']);

    // dd($watch, $platform, App\Actions\Platform\ExtractMakeHookToCatawiki::execute($watch, collect([])));

    $status = request()->query('status');

    if ( $status == 'success') 
    {
        // dd($status, $platform, [
        //     'status' => App\Models\PlatformData::STATUS_SUCCESS,
        //     'data'   => App\Actions\Platform\ExtractMakeHookToCatawiki::execute($watch, collect([])),
        //     'message'   => '',
        // ]);

        $platform->update([
            'status' => App\Models\PlatformData::STATUS_SUCCESS,
            'data'   => App\Actions\Platform\ExtractMakeHookToCatawiki::execute($watch, collect([])),
            'message'   => '',
        ]);
    
        $watch->update(['status' => "Review" ]);

        $platform->refresh();
        
        event(new \App\Events\ProcessPlatformEvent($watch, $platform));
    }
    else if ( $status == "failed") 
    {
        $platform->update([
            'status' => App\Models\PlatformData::STATUS_FAILED,
            'message'   => 'AI platform data failed',
        ]);
    
        $watch->update(['status' => "Draft" ]);
        event(new \App\Events\ProcessPlatformEvent($watch, $platform));
    }
    else if ( $status == "loading") 
    {
        $platform->update([
            'status' => App\Models\PlatformData::STATUS_LOADING,
            'message'   => 'AI platform data is loading',
        ]);
        event(new \App\Events\ProcessPlatformEvent($watch, $platform));
    }

    return response()->json(['status' => 'Event broadcasted!']);
});