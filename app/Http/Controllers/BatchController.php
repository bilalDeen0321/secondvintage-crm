<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreBatchRequest;
use App\Http\Requests\UpdateBatchRequest;
use App\Http\Resources\BatchResource;
use App\Models\Batch;
use App\Models\Brand;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
use Inertia\Inertia;

class BatchController extends Controller
{
    /**
     * Create a new controller instance.
     */
    public function __construct()
    {
        $this->middleware('permission:batchManagement');
    }

    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $batches = Batch::query()
            ->with(['watches']) // Load watches relationship
            ->orderBy('created_at', 'desc')
            ->paginate(10);


        return Inertia::render('batch/BatchIndex', [
            'batches' => BatchResource::collection($batches)
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
        $validated = $request->validate([
            'name' => [
                'required',
                'string',
                'min:2',
                'max:100',
                Rule::unique(Batch::class, 'name'),
            ],
            'tracking_number' => [
                'required',
                'string',
                'max:50',
                Rule::unique(Batch::class, 'tracking_number'),
            ],
            'origin' => 'required|string|max:100',
            'destination' => 'required|string|max:100',
            'status' => [
                'required',
                'string',
                Rule::in(Batch::STATUSES)
            ],
            'notes' => 'nullable|string|max:1000',
        ]);

        Batch::create([
            'name' => $validated['name'],
            'tracking_number' => $validated['tracking_number'],
            'origin' => $validated['origin'],
            'destination' => $validated['destination'],
            'status' => $validated['status'],
            'notes' => $validated['notes'] ?? null,
        ]);

        return redirect()->route('batches.index')->with('success', 'Batch created successfully.');
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
                Rule::in(['Preparing', 'Shipped', 'In Transit', 'Customs', 'Delivered'])
            ],
            'notes' => 'nullable|string|max:1000',
        ]);

        $batch->update($validated);

        return redirect()->route('batches.index')->with('success', 'Batch updated successfully.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Batch $batch)
    {
        $batch->delete();

        return redirect()->route('batches.index')->with('success', 'Batch deleted successfully.');
    }
}
