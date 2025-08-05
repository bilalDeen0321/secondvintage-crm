<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreWatchLogRequest;
use App\Http\Requests\UpdateWatchLogRequest;
use App\Models\WatchLog;

class WatchLogController extends Controller
{
    /**
     * Create a new controller instance.
     */
    public function __construct()
    {
        $this->middleware('permission:dashboard');
    }

    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        //
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
    public function store(StoreWatchLogRequest $request)
    {
        //
    }

    /**
     * Display the specified resource.
     */
    public function show(WatchLog $watchLog)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(WatchLog $watchLog)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateWatchLogRequest $request, WatchLog $watchLog)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(WatchLog $watchLog)
    {
        //
    }
}
