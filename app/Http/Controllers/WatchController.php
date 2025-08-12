<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreWatchRequest;
use App\Http\Requests\UpdateWatchRequest;
use App\Http\Resources\WatchResource;
use App\Models\Batch;
use App\Models\Brand;
use App\Models\Location;
use App\Models\Stage;
use App\Models\Status;
use App\Models\Watch;
use App\Models\WatchImage;
use App\Support\Str;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
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
            ->latest()
            ->with(['brand', 'location', 'status'])
            ->when($request->input('search'), function (Builder $q, $search) {
                $q->where(function ($sub) use ($search) {
                    $sub->where('name', 'like', "%{$search}%")
                        ->orWhere('sku', 'like', "%{$search}%")
                        ->orWhereHas('brand', fn($b) => $b->where('name', 'like', "%{$search}%"));
                });
            })
            ->when($request->input('status'), function (Builder $q, $value) {
                $q->whereIn('status', is_array($value) ? $value : $value);
            })
            ->when($request->input('brand'), function (Builder $q, $value) {
                $q->whereHas(
                    'brand',
                    fn($brandQuery) =>
                    $brandQuery->where('name', $value)
                );
            })
            ->when($request->input('location'), function (Builder $q, $value) {
                $q->where('location', $value);
            })
            ->orderBy($request->input('sortField', 'id'), $request->input('sortDirection', 'asc'));

        $watches = $query->paginate()->withQueryString();

        $watchCount = [
            'all' => Watch::count(),
        ];

        foreach (Status::allStatuses() as $status) {
            $watchCount[$status] = Watch::query()->where('status', $status)->count();
        }


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
        $locations = Location::query()->pluck('name')->unique()->values();
        $statuses  = Status::query()->pluck('name')->unique()->values();
        $batches   = Batch::query()->pluck('name')->unique()->values();
        $brands    = Brand::query()->pluck('name')->unique()->values();

        return Inertia::render('watches/create', [
            'locations' => $locations,
            'statuses' => $statuses,
            'batches' => $batches,
            'brands' => $brands,
        ]);
    }

    /**
     * Store a newly created resource in storage.
     * 
     * @param \Illuminate\Http\Request $request
     */
    public function store(StoreWatchRequest $request)
    {
        $validated = $request->validated();

        $brand = Brand::firstOrCreate(['name' => $validated['brand']]);
        $batch = Batch::firstOrCreate(['name' => $validated['batch']]);

        // 2. Create Watch
        $watch = Watch::query()->create([
            'sku'             => $validated['sku'],
            'name'            => $validated['name'],
            'serial_number'   => $validated['serial_number'],
            'reference'       => $validated['reference'],
            'case_size'       => $validated['case_size'],
            'caliber'         => $validated['caliber'],
            'timegrapher'     => $validated['timegrapher'],
            'original_cost'   => $validated['original_cost'],
            'current_cost'    => $validated['current_cost'],
            'currency'        => $validated['currency'],
            'description'     => $validated['description'] ?? '',
            'notes'           => $validated['notes'] ?? '',
            'ai_instructions' => $validated['ai_instructions'] ?? '',
            'status'          => $validated['status'],
            'location'        => $validated['location'],
            'brand_id'        => $brand->id,
            'batch_id'        => $batch->id,
        ]);

        // 3. Handle Base64 Images
        if (!empty($validated['images']) && is_array($validated['images'])) {
            foreach ($validated['images'] as $imageData) {
                if (!empty($imageData['url'])) {
                    WatchImage::storeBase64Image($watch, $imageData['url']);
                }
            }
        }


        return redirect()->route('watches.index')
            ->with('success', 'Watch created successfully.');
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
