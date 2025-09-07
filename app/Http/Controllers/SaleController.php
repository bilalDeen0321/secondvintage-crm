<?php

namespace App\Http\Controllers;

use App\Http\Resources\WatchResource;
use App\Models\Watch;
use App\Queries\WatchQuery;
use Illuminate\Http\Request;
use Inertia\Inertia;
use \Illuminate\Database\Eloquent\Builder;
use Illuminate\Support\Arr;

class SaleController extends Controller
{
    /**
     * Create a new controller instance.
     */
    public function __construct()
    {
        $this->middleware('permission:multiplatformSales');
    }

    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {

        // Get paginated results
        $watches = WatchQuery::init()
            ->execute($request)
            ->when($request->filled('platform'), function (Builder $q) use ($request) {
                $locations = Arr::wrap($request->input('platform'));
                $q->where('platform', $locations);
            })
            ->with('platforms:id,name,watch_id,status,message')
            ->paginate($request->input('per_page'))
            ->withQueryString();

        return Inertia::render('sales/SalesIndex', [
            ...WatchQuery::init()->crudData(),
            'watches' => WatchResource::collection($watches)->response()->getData(true),
            'filters' => WatchQuery::init()->getFiltersColumns($request),
            'watch_count' => WatchQuery::init()->getCounts(),
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
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
    public function show(Watch $watch, Request $request)
    {

        $platformName = $watch->platform;

        $platform = $watch->platforms()->where('name', $platformName)->first();

        $nextItem = Watch::where('id', '<', $watch->id) // smaller id for next in latest-first
            ->where('platform', $platformName)
            // ->orderBy('id', 'desc')
            ->first();

        $prevItem = Watch::where('id', '>', $watch->id) // larger id for previous in latest-first
            ->where('platform', $platformName)
            // ->orderBy('id', 'asc')
            ->first();

        return Inertia::render('sales/SalesShow', [
            'watch' => new WatchResource($watch->load('platforms:id,name,watch_id,status,message')),
            'platform' => $platform,
            'nextItem' => $nextItem ? new WatchResource($nextItem) : null,
            'prevItem' => $prevItem ? new WatchResource($prevItem) : null,
            'params' => $request->query(), // Pass all query parameters
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(string $id)
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
