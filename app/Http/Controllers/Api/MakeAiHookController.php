<?php

namespace App\Http\Controllers\Api;

use App\Actions\Watch\GenerateAiDescriptionAction;
use App\Actions\Watch\UpdateOrCreateAction;
use App\Http\Controllers\Controller;
use App\Http\Requests\Watch\AIGenerateRequest;
use App\Http\Requests\Watch\UpdateOrCreateRequest;
use App\Http\Resources\WatchResource;
use App\Jobs\ProcessWatchAIDescriptionJob;
use App\Models\Log;
use App\Models\Status;
use App\Models\Watch;
use App\Services\Api\MakeAiHook;
use App\Traits\ApiResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Arr;
use Illuminate\Support\Facades\Log as FacadesLog;

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
                'description'     => $make->get('Description') ?? 'No description',
                'ai_thread_id'    => $make->get('Thread_ID'),
                'status_selected' => $make->get('Status_Selected') ?? Status::DRAFT,
            ]);
        }

        // If Make.com fails
        throw new \RuntimeException(
            $make->get('Message') ?? 'Something went wrong with make.com'
        );
    }
    /**
     * Hanld make.com ai generate watch description.
     * 
     * @param \Illuminate\Http\Request $request
     */
    public function withQueue(UpdateOrCreateRequest $request, UpdateOrCreateAction $action)
    {

        $watch = $action($request->only(['name', 'sku']), $request->all());

        dispatch(new ProcessWatchAIDescriptionJob($watch));

        $watch->refresh();

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
