<?php

namespace App\Http\Controllers;

use App\Actions\Platform\ExractMakeHookToTradera;
use App\Actions\Platform\ExtractMakeHookToCatawiki;
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
            'platform' => 'required|string|in:' . PlatformData::CATAWIKI,
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

        match ($platformName) {
            PlatformData::CATAWIKI => dispatch(new \App\Jobs\ProcessMakeHookCatawiki($watch, $platform)),
            PlatformData::TRADERA => dispatch(new \App\Jobs\ProcessMakeHookTradera($watch, $platform)),
            default => null,
        };

        // Dispatch the job to process AI data extraction
        dispatch(new \App\Jobs\ProcessMakeHookCatawiki($watch, $platform));

        return back()->with('success', 'AI data is being generating.');
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

    /**
     * Handle changes to platform data.
     */
    public function changes(Request $request, Watch $watch)
    {
        $platform = $request->input('platform');

        if ($watch->platforms()->where('name', $platform)->exists()) {
            return back();
        }

        if (in_array($platform, PlatformData::all_patforms())) {
            return $this->aiFill($request, $watch);
        }

        $watch->update(['platform' => null]);

        return back()->with('success', 'Platform was unselect.');
    }
}
