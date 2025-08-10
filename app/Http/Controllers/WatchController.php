<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreWatchRequest;
use App\Http\Requests\UpdateWatchRequest;
use App\Http\Resources\WatchResource;
use App\Models\Brand;
use App\Models\Location;
use App\Models\Stage;
use App\Models\Status;
use App\Models\Watch;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Http\Request;
use Inertia\Inertia;

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
        $query = Watch::query()
            ->with(['brand', 'location', 'status'])
            ->when($request->input('search'), function (Builder $q, $search) {
                $q->where(function ($sub) use ($search) {
                    $sub->where('name', 'like', "%{$search}%")
                        ->orWhere('sku', 'like', "%{$search}%")
                        ->orWhereHas('brand', fn($b) => $b->where('name', 'like', "%{$search}%"));
                });
            })
            ->when($request->input('status'), function (Builder $q, $value) {
                $q->whereHas(
                    'status',
                    fn($statusQuery) =>
                    $statusQuery->whereIn('name', is_array($value) ? $value : $value)
                );
            })
            ->when($request->input('brand'), function (Builder $q, $value) {
                $q->whereHas(
                    'brand',
                    fn($brandQuery) =>
                    $brandQuery->where('name', $value)
                );
            })
            ->when($request->input('location'), function (Builder $q, $value) {
                $q->whereHas(
                    'location',
                    fn($locationQuery) =>
                    $locationQuery->where('name', $value)
                );
            })
            ->orderBy($request->input('sortField', 'id'), $request->input('sortDirection', 'asc'));

        $watches = $query->paginate()->withQueryString();

        $watchCount = Status::whereHas('watches')
            ->withCount('watches')
            ->pluck('watches_count', 'name');


        return Inertia::render('watches/index', [
            'watches' => WatchResource::collection($watches)->response()->getData(true),
            'watch_count' => $watchCount,
            'filters' => request()->only(['search', 'status', 'brand', 'location', 'sortField', 'sortDirection']),
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        $locations = Location::query()->pluck('name');
        $statuses  = Status::query()->pluck('name');
        $brands    = Brand::query()->pluck('name');

        return Inertia::render('watches/create', [
            'locations' => $locations,
            'statuses' => $statuses,
            'brands' => $brands,
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreWatchRequest $request)
    {

        $validated = $request->validated();

        // Get status ID by name (e.g. 'draft')
        $status = Status::where('name', $validated['status'])->firstOrFail();


        $brand = Brand::query()->updateOrCreate(
            ['name' => $validated['brand']],
            ['brand_code' => rand(1, 100)]
        );

        $watch = Watch::create([
            'sku' => $validated['sku'],
            'name' => $validated['name'],
            'brand_id' => $brand->id,
            'serial_number' => $validated['serial'],
            'reference' => $validated['ref'],
            'case_size' => $validated['caseSize'],
            'caliber' => $validated['caliber'],
            'timegrapher' => $validated['timegrapher'],
            'original_cost' => $validated['acquisitionCost'],
            'status_id' => $status->id,
            'stage_id' => Stage::factory()->create()->id,
            'description' => $validated['description'],
            'notes' => $validated['notes'],
            'ai_instructions' => $validated['aiInstructions'],
        ]);

        // Handle uploaded images (if any)
        if (!empty($validated['images'])) {
            foreach ($validated['images'] as $image) {

                $path = $image->store('watches/images', 'public');

                $watch->images()->create([
                    'path' => $path,
                ]);
            }
        }

        return redirect()->route('watches.index')->with('success', 'Watch created successfully.');
    }

    /**
     * Display the specified resource.
     */
    public function show(Watch $watch)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Watch $watch)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateWatchRequest $request, Watch $watch)
    {
        //
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
}
