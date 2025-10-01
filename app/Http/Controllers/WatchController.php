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
use App\Queries\WatchQuery;
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
        $perPage = $request->get('per_page', 50);
         $allowed = [20, 50, 100, 200, 500];
    if (!in_array($perPage, $allowed)) {
        $perPage = 50;
    }
        // Get paginated results  
        $watches = WatchQuery::init()
            ->execute($request)
            ->paginate($perPage)
            ->withQueryString();
        return Inertia::render('watches/index', [
            ...WatchQuery::init()->crudData(),
            'watches' => WatchResource::collection($watches)->response()->getData(true),
            'filters' => WatchQuery::init()->getFiltersColumns($request),
            'watch_count' => WatchQuery::init()->getCounts(),
            'perPage' => $perPage,
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        return Inertia::render('watches/create', WatchQuery::init()->crudData());
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
            ...WatchQuery::init()->crudData(),
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
