<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreWatchRequest;
use App\Http\Requests\UpdateWatchRequest;
use App\Http\Resources\WatchResource;
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
        $watches = Watch::with(['brand', 'status', 'batch', 'location', 'images'])->get();

        return Inertia::render('Watchs/Index', [
            'watches' => WatchResource::collection($watches)
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
    public function store(StoreWatchRequest $request)
    {
        //
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
        //
    }
}
