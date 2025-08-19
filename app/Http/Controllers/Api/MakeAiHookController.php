<?php

namespace App\Http\Controllers\Api;

use App\Actions\Watch\GenerateAiDescriptionAction;
use App\Actions\Watch\UpdateOrCreateAction;
use App\Events\WatchAiDescriptionProcessed;
use App\Http\Controllers\Controller;
use App\Http\Requests\UpdateWatchRequest;
use App\Http\Requests\Watch\UpdateOrCreateRequest;
use App\Http\Resources\WatchResource;
use App\Jobs\ProcessWatchAIDescription;
use App\Models\Status;
use App\Models\Watch;
use App\Services\Api\MakeAiHook;
use App\Traits\ApiResponse;
use Illuminate\Http\Request;

class MakeAiHookController extends Controller
{
    use ApiResponse;

    /**
     * Hanld make.com ai generate watch description.
     */
    public function generate(UpdateOrCreateRequest $request, UpdateOrCreateAction $action)
    {
        $watch = $action($request->validated());

        dispatch(new ProcessWatchAIDescription($watch));

        return response()->json([
            'status' => 'success',
            'watch'  => new WatchResource($watch),
        ]);
    }

    /**
     * Reset thread id form watch data
     */
    public function resetThread(Request $request)
    {

        $routeKey = $request->input('routeKey');

        Watch::where(Watch::routeKeyName(), $routeKey)->update(['ai_thread_id' => null]);

        return $this->apiSuccess('reset');
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
