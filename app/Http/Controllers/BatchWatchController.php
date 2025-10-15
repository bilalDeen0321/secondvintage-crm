<?php

namespace App\Http\Controllers;

use App\Http\Resources\BatchResource;
use App\Http\Resources\WatchResource;
use App\Models\Batch;
use App\Models\Watch;
use App\Models\Location;
use Illuminate\Http\Request;
use Inertia\Inertia;

class BatchWatchController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Batch $batch)
    {
          
        return Inertia::render('batch/BatchWatches', [
            'batch' => new BatchResource($batch->load(['watches.images', 'watches.brand'])),
            'watches' => WatchResource::collection(Watch::whereNull('batch_id')->with(['images', 'brand'])->limit(50)->get()),
            'locations' => Location::all(),
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
    public function show(string $id)
    {
        //
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
