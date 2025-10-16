<?php

namespace App\Http\Controllers\Api;

use App\Models\Watch;
use App\Models\Status;
use App\Traits\ApiResponse;
use App\Enums\WatchAiStatus;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use App\Http\Resources\WatchResource;
use App\Actions\Watch\WatchUpsertForAi;
use App\Jobs\ProcessWatchAIDescriptionJob;
use App\Http\Requests\Watch\AIGenerateRequest;
use App\Actions\Watch\GenerateAiDescriptionAction;

class MakeAiHookController extends Controller
{
    use ApiResponse;

    /**
     * Hanld make.com ai generate watch description.
     * 
     * @param \Illuminate\Http\Request $request
     */
    public function generate(AIGenerateRequest $request, GenerateAiDescriptionAction $action)
    {

        $make = $action($request);

        if ($make->get('Status') === 'success') {
            return response()->json([
                'status'          => 'success',
                'description'     => ai_description_format($make->get('Description')),
                'ai_thread_id'    => $make->get('Thread_ID'),
                'status_selected' => $make->get('Status_Selected') ?? Status::DRAFT,
            ]);
        }

        // If Make.com fails
        throw new \RuntimeException($make->get('Message') ?? 'Something went wrong with make.com');
    }
    /**
     * Hanld make.com ai generate watch description.
     * 
     * @param \Illuminate\Http\Request $request
     */
    public function withQueue(AIGenerateRequest $request, WatchUpsertForAi $action)
    {
        //check if the the request has a name and brand send to create or update action
        if ($request->input('name') && $request->input('brand')) {

            $watch = $action($request->all(), $request->input('routeKey'));

            $watch->update(['ai_status' => WatchAiStatus::loading, 'ai_message' => '']);

            dispatch(new ProcessWatchAIDescriptionJob($watch));

            return redirect()->route('watches.show', $watch)->with([
                'success' => 'Watch saved and AI description has been generating.',
                'data' => new WatchResource($watch), // Return the updated watch resource
            ]);
        }

        // If the request does not have a name and brand, generate description synchronously
        $make =  (new GenerateAiDescriptionAction)($request);

        return redirect()->back()->with([
            'status'        => $make->get('Status', 'error'),
            'message'       => $make->get('Message', 'No message'),
            'data'          => [
                'description'     => ai_description_format($make->get('Description')),
                'ai_thread_id'    => $make->get('Thread_ID'),
                'status' => $make->get('Status_Selected') ?? Status::DRAFT,
            ],
        ]);
    }

    /**
     * Handle reset of AI generation state.
     * 
     * @param \Illuminate\Http\Request $request
     */
    public function resetAiStatus(Request $request)
    {
        $watchId = $request->input('routeKey');

        if (!$watchId) {
            return redirect()->back()->with([
                'status'  => 'error',
                'message' => 'No watch specified.',
            ]);
        }

        $watch = Watch::where('sku', $watchId)->first();

        if (!$watch) {
            return redirect()->back()->with([
                'status'  => 'error',
                'message' => 'Watch not found.',
            ]);
        }

        // Reset AI loading state
        $watch->update([
            'ai_status'  => null,
            'ai_message' => null,
        ]);

        return redirect()->back()->with([
            'status'  => 'success',
            'message' => 'AI status has been reset.',
            'data'    => new WatchResource($watch),
        ]);
    }

    /**
     * Load full AI-generated description (on demand).
     */
    public function loadDescription(Request $request)
    {
        $routeKey = $request->input('routeKey');

        $watch = Watch::where('sku', $routeKey)->first();

        return response()->json([
            'status' => 'success',
            'description' => $watch->description ?? 'test description not found',
        ]);
    }

    /**
     * Reset thread id form watch data
     */
    public function resetThread(Request $request)
    {
        $routeKey = $request->input('routeKey');

        Watch::where(Watch::routeKeyName(), $routeKey)->update(['ai_thread_id' => null]);

        return redirect()->back()->with('success', 'AI thread id reset from database!');
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        //
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        //
    }
}
