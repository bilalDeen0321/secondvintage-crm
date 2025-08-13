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
        $query = Watch::query()
            ->latest()
            ->when($request->input('search'), function (Builder $q, $search) {
                $q->where(function ($sub) use ($search) {
                    $sub->where('name', 'like', "%{$search}%")
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
