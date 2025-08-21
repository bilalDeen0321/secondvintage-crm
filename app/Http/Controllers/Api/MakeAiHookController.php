<?php

namespace App\Http\Controllers\Api;

use App\Actions\Watch\AddNewWatch;
use App\Actions\Watch\GenerateAiDescriptionAction;
use App\Actions\Watch\UpdateOrCreateAction;
use App\Actions\Watch\WatchUpsertForAi;
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
                'description'     => $make->get('Description', 'No description'),
                'ai_thread_id'    => $make->get('Thread_ID'),
                'status_selected' => $make->get('Status_Selected') ?? Status::DRAFT,
            ],
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
