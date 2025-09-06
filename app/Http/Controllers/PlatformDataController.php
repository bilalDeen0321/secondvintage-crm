<?php

namespace App\Http\Controllers;

use App\Models\PlatformData;
use App\Models\Watch;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

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

        $request->validate(['platform' => 'required|string|in:' . PlatformData::CATAWIKI]);

        $platformName = $request->input('platform');

        $platform = $watch->platforms()->firstOrCreate(['name' => $platformName]);

        // Reset all platform statuses to default
        $watch->platforms()->getQuery()->update(['status' => PlatformData::STATUS_DEFAULT]);

        // Update the specific platform status to loading
        $platform->update(['status' => PlatformData::STATUS_LOADING]);

        //update that watch platform to current platform
        $watch->update(['platform' => $platformName]);

        //refresh the model before send it to others
        $watch->refresh();

        match ($platformName) {
            PlatformData::CATAWIKI => dispatch(new \App\Jobs\ProcessMakeHookCatawiki($watch, $platform)),
            PlatformData::TRADERA => dispatch(new \App\Jobs\ProcessMakeHookTradera($watch, $platform)),
            default => throw new \Exception('Unsupported platform: ' . $platformName),
        };

        return back()->with('success', 'AI data is being generating.');
    }

    /**
     * Fetch platform data for a specific watch.
     */
    public function fetch(Request $request, Watch $watch)
    {
        $request->validate(['platform' => 'required|string']);

        $platform = $watch->platforms()->where('name', $request->input('platform'))->first();

        return $platform;
    }

    /**
     * Handle changes to platform data.
     */
    public function changes(Request $request, Watch $watch)
    {
        $platform = $request->input('platform');

        if (count($watch->platforms()->where('name', $platform)?->data ?? [])) {
            $watch->update(['platform' => $platform]);
            return back()->with('info', 'Platform was updated with existing data.');
        }

        if (in_array($platform, PlatformData::all_patforms())) {
            return $this->aiFill($request, $watch);
        }

        $watch->update(['platform' => null]);

        return back()->with('success', 'Platform was unselect.');
    }


    /**
     * Handle bulk actions on platform data.
     */
    public function bulkActions(Request $request)
    {

        $request->validate([
            'ids' => 'required|array',
            'ids.*' => 'integer|exists:watches,id',
            'platform' => 'required|string',
        ]);

        $ids = $request->input('ids', []);
        $platform = $request->input('platform', null);

        DB::transaction(function () use ($ids, $platform) {
            $watches = Watch::whereIn('id', $ids)->get();
            foreach ($watches as $watch) {
                if ($platform && in_array($platform, PlatformData::all_patforms())) {
                    \App\Actions\Platform\WatchPlatformAction::execute($watch, $platform);
                } else {
                    // If platform is empty or invalid, remove the platform data
                    // $watch->platforms()->delete();
                    $watch->update(['platform' => null]);
                }
            }
        });

        return back()->with('success', 'Bulk platform changes action initiated.');
    }

    /**
     * Save platform data for a specific watch.
     */
    public function save(Request $request, Watch $watch)
    {
        $request->validate([
            'data' => 'required|array',
            'data.*' => 'nullable',
            'data.*type' => 'required|string',
            'data.*field' => 'required|string',
        ]);

        if (!$watch->platform) {
            return back()->with('error', 'Please select a platform first.');
        }

        $platform = $watch->platforms()->firstOrCreate(['name' => $watch->platform]);

        $platform->update(['data' => $request->array('data')]);

        return back()->with('success', 'Platform data saved successfully.');
    }

    /**
     * Show platform data for a specific watch.
     */
    public function show(Request $request, Watch $watch)
    {
        $request->validate(['platform' => 'required|string']);

        $platformName = $request->input('platform');

        $platform = $watch->platforms()->where('name', $platformName)->first();

        //get the next watch for this platform
        $nextItem = Watch::where('id', '>', $watch->id)->where('platform', $platformName)->orderBy('id')->first()?->only(['id', 'routeKey']);

        //get the previous watch for this platform
        $prevItem = Watch::where('id', '<', $watch->id)->where('platform', $platformName)->orderBy('id', 'desc')->first()?->only(['id', 'routeKey']);

        return back()->with('data', [
            'platform' => $platform,
            'nextItem' => $nextItem,
            'prevItem' => $prevItem,
        ]);
    }
}
