<?php

namespace App\Http\Controllers;

use App\Http\Requests\StorePlatformDataRequest;
use App\Http\Requests\UpdatePlatformDataRequest;
use App\Models\PlatformData;
use Inertia\Inertia;

class PlatformDataController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        return Inertia::render('FullDataView');
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
    public function store(StorePlatformDataRequest $request)
    {
        //
    }

    /**
     * Display the specified resource.
     */
    public function show(PlatformData $platformData)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(PlatformData $platformData)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdatePlatformDataRequest $request, PlatformData $platformData)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(PlatformData $platformData)
    {
        //
    }
}
