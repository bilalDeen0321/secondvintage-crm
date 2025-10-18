<?php

namespace App\Http\Controllers\Api;

use App\Enums\WatchAiStatus;
use App\Models\Status;
use App\Models\Watch;
use App\Models\PlatformData;
use App\Actions\Platform\ExtractMakeHookToCatawiki;

use Illuminate\Http\Request;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Log;
use Illuminate\Validation\Rule;
use App\Http\Controllers\Controller;
use Symfony\Component\HttpFoundation\Response;
use Illuminate\Support\Facades\Log as LaravelLog;

final class MakeAiCallbackController extends Controller
{
    public function __invoke(Request $request)
    {
        // --- Auth ---
        // abort_unless($request->header('X-Make-Token') === config('services.make.token'), Response::HTTP_UNAUTHORIZED);

        // --- Validate ---
        // $validated = $request->validate([
        //     'watch_id'         => ['required', 'integer', 'exists:watches,id'],
        //     'kind'             => ['required', Rule::in(['platform', 'description'])],
        //     'status'           => ['required', Rule::in(['success', 'error'])],
        //     'message'          => ['nullable', 'string'],
        //     'data'             => ['nullable', 'array'],
        //     'thread_id'        => ['nullable', 'string'],
        //     'idempotency_key'  => ['required', 'string', 'max:128'],
        // ]);

        //first
        // $data = (object)$request->all();
        // $data = (object) $request->json()->all();
        // LaravelLog::info('Make AI Callback received: '. json_encode($request->all()));
        // end first

        // second
        // $rawBody = $request->getContent();
        // LaravelLog::info('Make AI Callback raw body: ' . $rawBody);

        // $data = json_decode($rawBody);

        // if (!$data) {
        //     LaravelLog::error('Failed to decode Make AI Callback JSON: ' . $rawBody);
        //     return response()->json(['error' => 'Invalid JSON'], 400);
        // }
        // end second

        // third
        $rawBody = $request->getContent();
        LaravelLog::info('Make AI Callback raw body: ' . $rawBody);

        // try decode
        $data = json_decode($rawBody);

        // always inspect json_last_error()
        if (json_last_error() !== JSON_ERROR_NONE) {
            LaravelLog::error('Make AI Callback JSON decode failed: ' . json_last_error_msg() . ' | raw: ' . $rawBody);
            // don't return 400 to Make; just acknowledge receipt so Make doesn't treat it as a failed webhook
            return response()->noContent(200);
        }

        // helpful debug: show type + value
        LaravelLog::info('Make AI Callback decoded type: ' . gettype($data) . ' | value: ' . var_export($data, true));

        // end third

        if ( $data->Action == 'GenerateDescription' && $data->Status == 'success' && $data->StatusCode == '200' ) 
        {     
            $watch = Watch::whereSku($data->SKU)->first();
            
            if ($watch) {
                $watch->update([
                    'status'       => $data->Status_Selected ?? null,
                    'ai_status'    => \App\Enums\WatchAiStatus::success,
                    'ai_message'   => $data->Message ?? null,
                    'ai_thread_id' => $data->Thread_ID ?? null,
                    'description'  => ai_description_format($data->Description ?? ''),
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
                    'ai_status'    => \App\Enums\WatchAiStatus::failed,
                    'ai_message'   => $data->Message ?? null
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
                    'status' => \App\Models\PlatformData::STATUS_SUCCESS,
                    'data'   => \App\Actions\Platform\ExtractMakeHookToCatawiki::execute($watch, collect($request->all())),
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
                    'status' => \App\Models\PlatformData::STATUS_FAILED,
                    'message'   => $data->Message,
                ]);

                $platform->refresh();
            
                event(new \App\Events\ProcessPlatformEvent($watch, $platform));
            }
        }
    }
}
