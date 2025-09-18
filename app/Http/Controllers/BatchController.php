<?php

namespace App\Http\Controllers;

use App\Enums\BatchStatus;
use App\Http\Requests\StoreBatchRequest;
use App\Http\Requests\UpdateBatchRequest;
use App\Http\Resources\BatchResource;
use App\Http\Resources\WatchResource;
use App\Models\Batch;
use App\Models\Brand;
use App\Models\Watch;
use App\Queries\BatchQuery;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
use Inertia\Inertia;
use Illuminate\Support\Facades\Log;
use Exception;
use Illuminate\Support\Facades\Route; 


use function Psy\Test\Command\ListCommand\Fixtures\bar;

class BatchController extends Controller
{
    /**
     * Create a new controller instance.
     */
    public function __construct()
    {
        $this->middleware('permission:batchManagement');

        // Route::bind('watch', function ($value) {
        //     return Watch::where('id', $value)->firstOrFail();
        // });
    }

    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {

        // Get paginated results
        $batches = BatchQuery::init()->execute($request)->paginate(10)->withQueryString();

        // Get available watches (unassigned to any batch)
        $availableWatches = Watch::query()->whereNull('batch_id')->with(['images', 'brand'])->get();

        return Inertia::render('batch/BatchIndex', [
            'batches' => BatchResource::collection($batches)->response()->getData(true),
            'availableWatches' => WatchResource::collection($availableWatches),
            'batchStastistics' => BatchQuery::init()->getStatistics()
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create() {}

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $data = $request->validate([
            'name'              => 'required|string|min:2|max:100|unique:batches,name',
            'tracking_number'   => 'nullable|string|max:50|unique:batches,tracking_number',
            'origin'            => 'nullable|string|max:100',
            'destination'       => 'nullable|string|max:100',
            'status'            => 'nullable|string|in:' . implode(',', Batch::STATUSES),
            'notes'             => 'nullable|string|max:1000'
        ]);

        Batch::query()->create($data);

        return back()->with('success', 'Batch created successfully.');
    }

    /**
     * Display the specified resource.
     */
    public function show(Batch $batch)
    {
        return $this->edit($batch);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Batch $batch)
    {
        return Inertia::render('batch/BatchEdit', [
            'batch' => new BatchResource($batch->load(['watches.images', 'watches.brand'])),
            //available watches that are not assigned to any batch
            'watches' => WatchResource::collection(Watch::whereNull('batch_id')->with(['images', 'brand'])->get()),
        ]);
    }

    /**
     * Update the specified resource in batch.
     */
    public function update(Request $request, Batch $batch)
    {
        
        $data = $request->validate([
    'name' => [
        'required',
        'string',
        'min:2',
        'max:100',
        Rule::unique('batches', 'name')->ignore($batch->id),
    ],
    'tracking_number' => [
        'nullable',
        'string',
        'max:50',
        Rule::unique('batches', 'tracking_number')->ignore($batch->id),
    ],
    'origin' => 'nullable|string|max:100',
    'destination' => 'nullable|string|max:100',
    'status' => 'nullable|string|in:' . implode(',', Batch::STATUSES),
    'notes' => 'nullable|string|max:1000',
]);

        $batch->update($data);

        return back()->with('success', 'Batch updated successfully.');
    }


    /**
     * Assign watches to batch 
     */
    public function assignWatches(Request $request, Batch $batch)
    {

        $request->validate([
            'ids'  => 'required|array|min:1',
            'ids.*' => 'exists:watches,id'
        ]);


        $query = Watch::whereIn('id', $request->array('ids'));

        // Check if watches are already assigned to other batches
        $alreadyAssigned = $query->whereNotNull('batch_id')
            ->where('batch_id', '!=', $batch->id)
            ->count();

        if ($alreadyAssigned > 0) {
            return back()->with('error', 'Some watches are already assigned to other batches.');
        }

        $batch->watches()->saveMany((clone $query)->get());

        return back()->with('success', 'Watches assigned to batch successfully.');
    }

    /**
     * Remove watch from batch
     */
    public function removeWatch(Batch $batch, Watch $watch)
    {
        try {
            Log::info('Removing watch from batch', [
                'batch_id' => $batch->id,
                'watch_id' => $watch->id,
                'watch_batch_id' => $watch->batch_id
            ]);

            if ($watch->batch_id != $batch->id) {
                Log::warning('Watch not assigned to batch', [
                    'watch_id' => $watch->id,
                    'watch_batch_id' => $watch->batch_id,
                    'expected_batch_id' => $batch->id
                ]);
                return back()->with('error', 'This watch is not assigned to this batch.');
            }

            $watch->update(['batch_id' => null]);

            Log::info('Watch successfully removed from batch', [
                'batch_id' => $batch->id,
                'watch_id' => $watch->id
            ]);

            // Return fresh data
            return $this->returnFreshData('success', 'Watch removed from batch successfully.');
        } catch (Exception $e) {
            Log::error('Error removing watch from batch: ' . $e->getMessage(), [
                'batch_id' => $batch->id,
                'watch_id' => $watch->id ?? 'unknown',
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);
            return back()->with('error', 'Failed to remove watch from batch. Please try again.');
        }
    }

    /**
     * Update batch status
     */
    public function updateStatus(Request $request, Batch $batch)
    {
        $request->validate([
            'status' => [
                'required',
                'string',
                Rule::in(BatchStatus::allStatuses())
            ],
        ]);

        if ($batch->status === $request->status) {
            return back()->with('info', 'Batch status is already set to the selected value.');
        }

        $batch->update(['status' => $request->status]);

        // Update location of all watches in the batch when status changes to "In Transit" or "Delivered"
        if (in_array($request->status, [BatchStatus::IN_TRANSIT->value, BatchStatus::DELIVERED->value])) {
            $newLocation = $request->status === BatchStatus::IN_TRANSIT->value
                ? 'In Transit'
                : $batch->destination; // Use batch destination when delivered

            $batch->watches()->update(['location' => $newLocation]);
        }

        return back()->with('success', 'Batch status updated successfully.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Batch $batch)
    {
        $batch->delete();

        return redirect()->route('batches.index')->with('success', 'Batch deleted successfully.');
    }

    /**
     * Return fresh data for the index page
     */
    private function returnFreshData(string $messageType, string $message)
    {
        $batches = Batch::query()
            ->with(['watches.images', 'watches.brand'])
            ->orderBy('created_at', 'desc')
            ->paginate(10);

        $availableWatches = Watch::query()
            ->whereNull('batch_id')
            ->with(['images', 'brand'])
            ->get();

        return Inertia::render('batch/BatchIndex', [
            'batches' => BatchResource::collection($batches),
            'availableWatches' => WatchResource::collection($availableWatches),
            'batchStastistics' => BatchQuery::init()->getStatistics(),
        ])->with($messageType, $message);
    }
}
