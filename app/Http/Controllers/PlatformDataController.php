<?php

namespace App\Http\Controllers;

use App\Models\PlatformData;
use App\Models\Watch;
use Illuminate\Http\Request;

class PlatformDataController extends Controller
{
    /**
     * Create a new controller instance.
     */
    public function __construct()
    {
        $this->middleware('permission:dashboard');
    }

    /**
     * Fill platform data using AI.
     */
    public function aiFill(Request $request, Watch $watch)
    {

        $request->validate([
            'platform' => 'required|string|in:' . implode(',', PlatformData::all_patforms() ?? []),
        ]);

        $platformName = $request->input('platform');

        $platform = $watch->platforms()->where('name', $platformName)->first();

        if (!$platform) {
            $platform = $watch->platforms()->create([
                'name' => $platformName,
            ]);
        };

        // Reset all platform statuses to default
        $watch->platforms()->getQuery()->update(['status' => PlatformData::STATUS_DEFAULT]);

        // Update the specific platform status to loading
        $platform->update(['status' => PlatformData::STATUS_LOADING]);

        // Dispatch the job to process AI data extraction
        dispatch(new \App\Jobs\ProcessMakeHookCatawiki($watch, $platform));

        // return back()->with('success', 'AI data is being generating. This may take a moment.');
    }

    /**
     * Fetch platform data for a specific watch.
     */
    public function fetch(Request $request, Watch $watch)
    {
        $request->validate(['platform' => 'required|string|']);

        $platform = $watch->platforms()->where('name', $request->input('platform'))->first();

        return $platform;
    }
}
