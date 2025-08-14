<?php

namespace App\Http\Controllers;

use App\Actions\Watch\AddNewWatch;
use App\Actions\Watch\UpdateWatchAction;
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
use Illuminate\Validation\Rule;
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

        // Define allowed columns for sorting
        $allow_columns = [
            'id',
            'name',
            'sku',
            'status',
            'location',
            'original_cost',
            'created_at',
            'updated_at'
        ];

        $columns = $request->input('columns', 'id');
        $direction = $request->input('direction', 'desc');

        // Validate sort field
        if (!in_array($columns, $allow_columns)) {
            $columns = 'id';
        }

        // Validate sort direction
        if (!in_array(strtolower($direction), ['asc', 'desc'])) {
            $direction = 'desc';
        }

        $query = Watch::query()
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
                $brands = $request->input('brand');
                // Support multiple brands
                if (is_array($brands)) {
                    $q->whereHas('brand', function ($brandQuery) use ($brands) {
                        $brandQuery->whereIn('name', $brands);
                    });
                } else {
                    $q->whereHas('brand', function ($brandQuery) use ($brands) {
                        $brandQuery->where('name', $brands);
                    });
                }
            })
            ->when($request->filled('status'), function (Builder $q) use ($request) {
                $statuses = $request->input('status');
                // Support multiple statuses
                if (is_array($statuses)) {
                    $q->whereIn('status', $statuses);
                } else {
                    $q->where('status', $statuses);
                }
            })
            ->when($request->filled('location'), function (Builder $q) use ($request) {
                $locations = $request->input('location');
                // Support multiple locations
                if (is_array($locations)) {
                    $q->whereIn('location', $locations);
                } else {
                    $q->where('location', $locations);
                }
            })
            ->orderBy($columns, $direction);

        // Get paginated results
        $watches = $query->paginate($request->input('per_page', 10))->withQueryString();

        // Get counts for different statuses
        $watchCount = ['all' => Watch::count()];
        foreach (Status::allStatuses() as $status) {
            $watchCount[$status] = Watch::where('status', $status)->count();
        }

        return Inertia::render('watches/index', [
            'watches' => WatchResource::collection($watches)->response()->getData(true),
            'watch_count' => $watchCount,
            'filters' => request()->only(['search', 'status', 'brand', 'location', 'columns', 'direction']),
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {

        return Inertia::render('watches/create', [
            'locations' => Location::query()->pluck('name')->unique()->values(),
            'statuses' => Status::query()->pluck('name')->unique()->values(),
            'batches' => Batch::query()->pluck('name')->unique()->values(),
            'brands' => Brand::query()->pluck('name')->unique()->values(),
        ]);
    }

    /**
     * Store a newly created resource in storage.
     * 
     * @param \Illuminate\Http\Request $request
     */
    public function store(StoreWatchRequest $request, AddNewWatch $action)
    {
        $validated = $request->validated();

        try {

            $action($validated);

            //successfully response
            return redirect()->route('watches.index')
                ->with('success', 'Watch created successfully.');
        } catch (\Throwable $th) {
            return redirect()->back()->withErrors($th->getMessage());
        }
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

        return Inertia::render('watches/edit', [
            'watch' => new WatchResource($watch),  // single model resource, not collection
            'nextItem' => $nextItem ? new WatchResource($nextItem) : null,
            'previousItem' => $previousItem ? new WatchResource($previousItem) : null,

            //form data
            'locations' => Location::query()->pluck('name')->unique()->values(),
            'statuses' => Status::query()->pluck('name')->unique()->values(),
            'batches' => Batch::query()->pluck('name')->unique()->values(),
            'brands' => Brand::query()->pluck('name')->unique()->values(),
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Watch $watch, UpdateWatchAction $action)
    {
        $input = $request->validate([
            'name'            => ['required', 'string', 'max:255'],
            'sku'             => [
                'required',
                'string',
                'max:255',
                Rule::unique('watches', 'sku')->ignore($watch->id),
            ],
            'brand'           => ['required', 'string', 'max:255'],
            'status'          => ['required', 'string', 'max:255'],
            'serial_number'   => ['nullable', 'string', 'max:255'],
            'reference'       => ['nullable', 'string', 'max:255'],
            'case_size'       => ['nullable', 'string', 'max:255'],
            'caliber'         => ['nullable', 'string', 'max:255'],
            'timegrapher'     => ['nullable', 'string', 'max:255'],
            'original_cost'   => ['required', 'numeric'],
            'current_cost'    => ['nullable', 'numeric'],
            'location'        => ['nullable', 'string', 'max:255'],
            'batch'           => ['nullable', 'string', 'max:255'],
            'description'     => ['nullable', 'string'],
            'currency'        => ['nullable', 'string', 'max:3'],
            'notes'           => ['nullable', 'string'],
            'ai_instructions' => ['nullable', 'string'],

            'images'          => ['nullable', 'array'],
            'images.*.url'    => ['required_with:images', 'string'],
        ], [
            'sku.unique'         => 'This SKU already exists in the database.',
            'images.*.url.regex' => 'Each image must be a valid base64 encoded PNG or JPEG.',
        ]);

        $action($watch, $input);

        return redirect()->back()->with('success', 'Watch updated successfully.');
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
