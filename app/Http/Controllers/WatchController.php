<?php

namespace App\Http\Controllers;

use App\Actions\Watch\AddNewWatch;
use App\Actions\Watch\UpdateWatchAction;
use App\Http\Requests\StoreWatchRequest;
use App\Http\Requests\UpdateWatchRequest;
use App\Http\Resources\WatchResource;
use App\Models\Batch;
use App\Models\Brand;
use App\Models\Currency;
use App\Models\Location;
use App\Models\Status;
use App\Models\Watch;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Http\Request;
use Illuminate\Support\Arr;
use Illuminate\Support\Facades\Log;
use Inertia\Inertia;
use Spatie\QueryBuilder\QueryBuilder;

class WatchController extends Controller
{

    /**
     * Create a new controller instance.
     */
    public function __construct()
    {
        $this->middleware('permission:watchManagement');
    }

    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {

        // Map frontend column names to database columns if needed
        $sortableColumns = [
            'name' => 'name',
            'sku' => 'sku',
            'created_at' => 'created_at',
            'brand' => 'brand',
            'original_cost' => 'original_cost',
            'current_cost' => 'current_cost',
            'status' => 'status',
            'location' => 'location',
        ];

        // Get sorting from frontend
        $orders = $request->input('order', [
            'column' => 'created_at',
            'dir'    => 'asc'
        ]);

        $query = QueryBuilder::for(Watch::class);

        // Apply multi-column sorting from frontend if exists
        $orders = $request->input('order', []);
        $orders = is_array($orders) ? $orders : [$orders];

        if (!empty($orders)) {
            foreach ($orders as $order) {
                $column = $order['column'] ?? null;
                $dir = $order['dir'] ?? 'asc';
                if ($column && isset($sortableColumns[$column])) {
                    $query->orderBy($sortableColumns[$column], $dir);
                }
            }
        } else {
            // Default sorting by latest created
            $query->orderBy('created_at', 'desc');
        }

        $query
            ->when($request->filled('search'), function (Builder $q) use ($request) {
                $search = $request->input('search');
                $q->where(function ($sub) use ($search) {
                    $sub->where('name', 'like', "%{$search}%")
                        ->orWhere('sku', 'like', "%{$search}%")
                        ->orWhere('location', 'like', "%{$search}%")
                        // ->orWhere('original_cost', 'like', "%{$search}%")
                        ->orWhereHas('brand', function ($brandQuery) use ($search) {
                            $brandQuery->where('name', 'like', "%{$search}%");
                        });
                });
            })
            ->when($request->filled('brand'), function (Builder $q) use ($request) {
                $brands = Arr::wrap($request->input('brand'));
                $q->whereHas('brand', fn($brandQuery) => $brandQuery->whereIn('name', $brands));
            })
            ->when($request->filled('batch'), function (Builder $q) use ($request) {
                $batches = Arr::wrap($request->input('batch'));
                $q->whereHas('batch', fn($batchQuery) => $batchQuery->whereIn('name', $batches));
            })
            ->when($request->filled('status'), function (Builder $q) use ($request) {
                $statuses = Arr::wrap($request->input('status'));
                $q->whereIn('status', $statuses);
            })
            ->when($request->filled('location'), function (Builder $q) use ($request) {
                $locations = Arr::wrap($request->input('location'));
                $q->whereIn('location', $locations);
            });

        // Get paginated results
        $watches = $query->paginate($request->input('per_page', 10))->withQueryString();

        // Get counts for different statuses
        $watchCount = ['all' => Watch::count()];
        foreach (Status::allStatuses() as $status) {
            $watchCount[$status] = Watch::where('status', $status)->count();
        }

        return Inertia::render('watches/index', [
            ...$this->crudData(),
            'watches' => WatchResource::collection($watches)->response()->getData(true),
            'watch_count' => $watchCount,
            'filters' => request()->only(['search', 'status', 'brand', 'location', 'columns', 'direction']),
        ]);
    }

    /**
     * The controller's actions data for watch management.
     */
    public function crudData()
    {
        return [
            'currencies' => Currency::query()->latest()->get(),
            'locations' => Location::query()->latest()->pluck('name')->unique()->values(),
            'statuses' => Status::query()->latest()->pluck('name')->unique()->values(),
            'batches' => Batch::query()->latest()->pluck('name')->unique()->values(),
            'brands' => Brand::query()->latest()->pluck('name')->unique()->values(),
        ];
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        return Inertia::render('watches/create', $this->crudData());
    }

    /**
     * Display the specified resource.
     */
    public function show(Watch $watch)
    {
        return $this->edit($watch);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Watch $watch)
    {

        $nextItem = Watch::where('id', '<', $watch->id) // smaller id for next in latest-first
            ->orderBy('id', 'desc')
            ->first();

        $previousItem = Watch::where('id', '>', $watch->id) // larger id for previous in latest-first
            ->orderBy('id', 'asc')
            ->first();

        return Inertia::render('watches/create', [
            ...$this->crudData(),
            'watch' => new WatchResource($watch),  // single model resource, not collection
            'nextItem' => $nextItem ? new WatchResource($nextItem) : null,
            'previousItem' => $previousItem ? new WatchResource($previousItem) : null,
        ]);
    }

    /**
     * Store a newly created resource in storage.
     * 
     * @param \Illuminate\Http\Request $request
     */
    public function store(StoreWatchRequest $request, AddNewWatch $action)
    {
        try {

            $watch =  $action($request->validated());

            //successfully response
            return redirect()->back()->with([
                'success' => 'Watch created successfully.',
                'data' => $watch,
            ]);

            //
        } catch (\Throwable $th) {
            return redirect()->back()->withErrors($th->getMessage());
        }
    }



    /**
     * Update the specified resource in storage.
     * 
     * @param \Illuminate\Http\Request $request
     */
    public function update(Watch $watch, UpdateWatchRequest $request, UpdateWatchAction $action)
    {
        // Validate the request
        $input = $request->validated();

        $action($watch, $input);

        $watch->refresh(); // Refresh the watch model to get updated data

        return redirect()->route('watches.show', $watch)->with([
            'success' => 'Watch saved.',
            'data' => new WatchResource($watch), // Return the updated watch resource
        ]);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Watch $watch)
    {
        // Delete the watch itself
        $watch->delete();

        return redirect()->back()->with('success', 'Watch deleted successfully.');
    }

    /**
     * Approve the watch 
     */
    public function approve(Watch $watch)
    {

        $watch->update(['status' => Status::APPROVED]);

        return redirect()->back()->with('success', 'Approved');
    }

    /**
     * Bulk actions
     */
    /**
     * Bulk actions
     */
    public function bulkActions(Request $request)
    {
        $ids = $request->input('ids', []);
        $action = $request->input('action');
        $value = $request->input('value');

        if ($action === 'status' && $value) {
            Watch::whereIn('id', $ids)->update(['status' => $value]);

            return redirect()->back()->with('success', 'Bulk status updated');
        }

        if ($action === 'location' && $value) {
            Watch::whereIn('id', $ids)->update(['location' => $value]);

            return redirect()->back()->with('success', 'Bulk location updated');
        }

        if ($action === 'batch' && $value) {
            $batch = Batch::updateOrCreate(['name' => $value]); // single query
            Watch::whereIn('id', $ids)->update(['batch_id' => $batch->id]);
            return redirect()->back()->with('success', 'Bulk batch updated');
        }

        return redirect()->back()->with('error', 'Unknown bulk action');
    }
}
