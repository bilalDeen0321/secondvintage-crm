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

        Route::bind('watch', function ($value) {
            return Watch::where('id', $value)->firstOrFail();
        });
    }

    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {

        // Get paginated results
        $batches = BatchQuery::init()
            ->execute($request)
            ->paginate(20)
            ->withQueryString();

        // Get available watches (unassigned to any batch)
        $availableWatches = Watch::query()
            ->whereNull('batch_id')
            ->with(['images', 'brand'])
            ->get();

        return Inertia::render('batch/BatchIndex', [
            'batches' => BatchResource::collection($batches),
            'availableWatches' => WatchResource::collection($availableWatches),
            'batchStastistics' => BatchQuery::init()->getStatistics()
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        return Inertia::render('batch/CreateBatch');
    }

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
        return Inertia::render('batch/ShowBatch', [
            'batch' => $batch
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Batch $batch)
    {
        return Inertia::render('batch/EditBatch', [
            'batch' => $batch
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Batch $batch)
    {
        $validated = $request->validate([
            'name' => [
                'required',
                'string',
                'min:2',
                'max:100',
                Rule::unique(Batch::class, 'name')->ignore($batch->id),
            ],
            'tracking_number' => [
                'required',
                'string',
                'max:50',
                Rule::unique(Batch::class, 'tracking_number')->ignore($batch->id),
            ],
            'origin' => 'required|string|max:100',
            'destination' => 'required|string|max:100',
            'status' => [
                'required',
                'string',
                Rule::in(BatchStatus::allStatuses())
            ],
            'notes' => 'nullable|string|max:1000',
        ]);

        $batch->update($validated);

        return redirect()->route('batches.index')->with('success', 'Batch updated successfully.');
    }

    /**
     * Update batch details only
     */
    public function updateDetails(Request $request, Batch $batch)
    {
        try {
            $validated = $request->validate([
                'name' => [
                    'required',
                    'string',
                    'min:2',
                    'max:100',
                    Rule::unique(Batch::class, 'name')->ignore($batch->id),
                ],
                'tracking_number' => [
                    'required',
                    'string',
                    'max:50',
                    Rule::unique(Batch::class, 'tracking_number')->ignore($batch->id),
                ],
                'origin' => 'required|string|max:100',
                'destination' => 'required|string|max:100',
                'status' => [
                    'required',
                    'string',
                    Rule::in(BatchStatus::allStatuses())
                ],
                'notes' => 'nullable|string|max:1000',
                'shipped_date' => 'nullable|date',
                'estimated_delivery' => 'nullable|date|after_or_equal:shipped_date',
                'actual_delivery' => 'nullable|date',
            ], [
                'estimated_delivery.after_or_equal' => 'Estimated delivery must be after or equal to shipped date.',
                'name.unique' => 'A batch with this name already exists.',
                'tracking_number.unique' => 'A batch with this tracking number already exists.',
            ]);

            $batch->update($validated);

            return back()->with('success', 'Batch details updated successfully.');
        } catch (Exception $e) {
            dd($e);
            Log::error('Error updating batch details: ' . $e->getMessage());
            return back()->with('error', 'Failed to update batch details. Please try again.');
        }
    }

    /**
     * Assign watches to batch
     */
    public function assignWatches(Request $request, Batch $batch)
    {
        try {
            $validated = $request->validate([
                'watch_ids' => 'required|array|min:1',
                'watch_ids.*' => 'exists:watches,id'
            ], [
                'watch_ids.required' => 'Please select at least one watch to assign.',
                'watch_ids.min' => 'Please select at least one watch to assign.',
                'watch_ids.*.exists' => 'One or more selected watches do not exist.',
            ]);

            // Check if watches are already assigned to other batches
            $alreadyAssigned = Watch::whereIn('id', $validated['watch_ids'])
                ->whereNotNull('batch_id')
                ->where('batch_id', '!=', $batch->id)
                ->count();

            if ($alreadyAssigned > 0) {
                return back()->with('error', 'Some watches are already assigned to other batches.');
            }

            // Update watches to assign them to this batch
            $assignedCount = Watch::whereIn('id', $validated['watch_ids'])
                ->whereNull('batch_id')
                ->update(['batch_id' => $batch->id]);

            if ($assignedCount === 0) {
                return back()->with('warning', 'No watches were assigned. They may already be assigned to batches.');
            }

            // Return fresh data
            return $this->returnFreshData('success', "{$assignedCount} watch(es) assigned to batch successfully.");
        } catch (Exception $e) {
            Log::error('Error assigning watches to batch: ' . $e->getMessage());
            return back()->with('error', 'Failed to assign watches. Please try again.');
        }
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
