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
    public function index()
    {
        $watches = Watch::with(['brand', 'status', 'batch', 'location', 'images'])->paginate();

        $watch_count = [
            'all' => Watch::query()->count(),
            Status::SOLD => Watch::query()->whereStatus(Status::SOLD)->count(),
            Status::DRAFT => Watch::query()->whereStatus(Status::DRAFT)->count(),
            Status::LISTED => Watch::query()->whereStatus(Status::LISTED)->count(),
            Status::REVIEW => Watch::query()->whereStatus(Status::REVIEW)->count(),
            Status::RESERVED => Watch::query()->whereStatus(Status::RESERVED)->count(),
            Status::PROBLEM => Watch::query()->whereStatus(Status::PROBLEM)->count(),
            Status::LISTING => Watch::query()->whereStatus(Status::LISTING)->count(),
            Status::STANDBY => Watch::query()->whereStatus(Status::STANDBY)->count(),
            Status::APPROVED => Watch::query()->whereStatus(Status::APPROVED)->count(),
            Status::PLATFORM_REVIEW => Watch::query()->whereStatus(Status::PLATFORM_REVIEW)->count(),
        ];

        return Inertia::render('watches/index', [
            'watch_count' => $watch_count,
            'watches' => WatchResource::collection($watches)
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
