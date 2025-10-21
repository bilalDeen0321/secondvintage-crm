<?php

use App\Models\Watch;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\MakeAiCallbackController;
use Psl\Ref;

// Route::get('/check-sku', function (Request $request) {
//     $sku = $request->query('sku');

//     if (!$sku) {
//         return response()->json(['redirect' => "https://secondvintage.com/404"]);
//     }

//     $watch = Watch::where('sku', $sku)->first();

//     if (!$watch) {
//         return response()->json(['redirect' => "https://secondvintage.com/404"]);
//     }

//     if (strtolower($watch->status) === 'sold') {
//         return response()->json([
//             'redirect' => "https://secondvintage.com/thankyou/{$sku}",
//             'data'     => $watch
//         ]);
//     }

//     return response()->json([
//         'redirect' => "https://secondvintage.com/watches/{$sku}",
//         'data'     => $watch
//     ]);
// });

Route::get('/check-sku', function (Request $request) {
    $sku = $request->query('sku');

    if (!$sku) {
        return response()->json([
            'status' => null,
            'message' => 'Missing SKU',
        ], 400);
    }

    $watch = Watch::where('sku', $sku)->first();

    if (!$watch) {
        // SKU not found
        return response()->json([
            'status' => null,
            'message' => 'SKU not found',
        ], 404);
    }

    // Return only what middleman needs
    return response()->json([
        'sku'    => $watch->sku,
        'status' => $watch->status,  // e.g. "Sold", "Draft", etc.
    ]);
});

Route::post('/make/ai/callback', MakeAiCallbackController::class);

Route::post('/test-watch', function(Request $request){

    $path = public_path('make-debug.json');
    $json = file_get_contents($path);
    $data = json_decode($json)->body;
    $data = (object)$request->all();

    if ( $data->Action == 'GenerateDescription' && $data->Status == 'success' && $data->StatusCode == '200' ) 
    {     
        $watch = Watch::whereSku($data->SKU)->first();
        
        if ($watch) {
            $watch->update([
                'status'       => $data->Status_Selected,
                'ai_status'    => App\Enums\WatchAiStatus::success,
                'ai_message'   => $data->Message,
                'ai_thread_id' => $data->Thread_ID,
                'description'  => ai_description_format($data->Description),
            ]);

            $watch->refresh();
            event(new \App\Events\WatchAiDescriptionProcessedEvent($watch));
        }
    }
    
    if ( $data->Action == 'GenerateDescription' && $data->Status == 'error' && $data->StatusCode == '500' ) 
    {
        $watch = Watch::whereSku($data->SKU)->first();
    
        if ($watch) {
            $watch->update([
                'ai_status'    => App\Enums\WatchAiStatus::failed,
                'ai_message'   => $data->Message
            ]);

            $watch->refresh();
            event(new \App\Events\WatchAiDescriptionProcessedEvent($watch));
        }
    }

    if ( $data->Action === 'GeneratePlatformData' && $data->Status === 'success' && $data->StatusCode === '200' ) 
    {
        $watch = Watch::whereSku($data->SKU)->first();

        if ( $watch )
        {

            $platform = $watch->platforms()->firstOrCreate(['name' => 'catawiki']);

            $platform->update([
                'status' => App\Models\PlatformData::STATUS_SUCCESS,
                'data'   => App\Actions\Platform\ExtractMakeHookToCatawiki::execute($watch, collect($request->all())),
                'message'   => '',
            ]);

            $watch->update(['status' => $data->Status_Selected ]);

            $watch->refresh();    
            $platform->refresh();

            event(new \App\Events\ProcessPlatformEvent($watch, $platform));
        }
    }
    
    if ($data->Action === 'GeneratePlatformData' && $data->Status === 'error' && $data->StatusCode === '500')
    {
        $watch = Watch::whereSku($data->SKU)->first();
        
        if ( $watch ) 
        {
            $platform = $watch->platforms()->firstOrCreate(['name' => 'catawiki']);
            
            $platform->update([
                'status' => App\Models\PlatformData::STATUS_FAILED,
                'message'   => $data->Message,
            ]);

            $platform->refresh();
        
            event(new \App\Events\ProcessPlatformEvent($watch, $platform));
        }
    }

    // $data->Status;
    // $data->StatusCode;
    // $data->Action;
    // $data->Message;
    // $data->SKU;
    // $data->Description;
    // $data->Status_Selected;
    // $data->Thread_ID;

    return response()->json(['status' => 'Event broadcasted!']);
});

Route::post('/test-platform', function(Request $request){

    $path = public_path('make-debug-platform.json');
    $json = file_get_contents($path);
    $data = json_decode($json)->body;
    $data = (object)$request->all();

    if ( $data->Action === 'GeneratePlatformData' && $data->Status === 'success' && $data->StatusCode === '200' ) 
    {
        $watch = Watch::whereSku($data->SKU)->first();

        if ( $watch )
        {

            $platform = $watch->platforms()->firstOrCreate(['name' => 'catawiki']);

            $platform->update([
                'status' => App\Models\PlatformData::STATUS_SUCCESS,
                'data'   => App\Actions\Platform\ExtractMakeHookToCatawiki::execute($watch, collect($request->all())),
                'message'   => '',
            ]);

            $watch->update(['status' => $data->Status_Selected ]);

            $watch->refresh();    
            $platform->refresh();

            event(new \App\Events\ProcessPlatformEvent($watch, $platform));
        }
    }
    
    if ($data->Action === 'GeneratePlatformData' && $data->Status === 'error' && $data->StatusCode === '500')
    {
        $watch = Watch::whereSku($data->SKU)->first();
        
        if ( $watch ) 
        {
            $platform = $watch->platforms()->firstOrCreate(['name' => 'catawiki']);
            
            $platform->update([
                'status' => App\Models\PlatformData::STATUS_FAILED,
                'message'   => $data->Message,
            ]);

            $platform->refresh();
        
            event(new \App\Events\ProcessPlatformEvent($watch, $platform));
        }
    }

    return response()->json(['status' => 'Event broadcasted!']);
});