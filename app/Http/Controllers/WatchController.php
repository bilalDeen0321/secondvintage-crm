<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreWatchRequest;
use App\Http\Requests\UpdateWatchRequest;
use App\Http\Resources\WatchResource;
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

        return Inertia::render('Watchs/Index', [
            'watch_count_total' => Watch::query()->count(),
            'watch_count_draft' => Watch::query()->whereStatus(Status::DRAFT)->count(),
            'watch_count_review' => Watch::query()->whereStatus(Status::REVIEW)->count(),
            'watch_count_approved' => Watch::query()->whereStatus(Status::APPROVED)->count(),
            'watch_count_platform' => Watch::query()->whereStatus(Status::PLATFORM_REVIEW)->count(),
            'watch_count_listed' => Watch::query()->whereStatus(Status::LISTED)->count(),
            'watch_count_reserved' => Watch::query()->whereStatus(Status::RESERVED)->count(),
            'watch_count_sold' => Watch::query()->whereStatus(Status::SOLD)->count(),
            'watch_count_problem' => Watch::query()->whereStatus(Status::DEFECT_PROBLEM)->count(),
            'watch_count_listing' => Watch::query()->whereStatus(Status::READY_FOR_LISTING)->count(),
            'watch_count_standby' => Watch::query()->whereStatus(Status::STANDBY)->count(),
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
