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
            'platform' => 'required|string|in:' . implode(',', PlatformData::PLATFORMS ?? []),
        ]);

        $platform = $request->input('platform');

        // Update watch table to set the platform name
        $watch->update(['platform' => $platform]);

        $watch->platforms()->getQuery()->update(['status' => PlatformData::STATUS_DEFAULT]);

        $watch->platforms()
            ->getQuery()
            ->where('name', $platform)
            ->update(['status' => PlatformData::STATUS_LOADING]);

        // Dispatch the job to process AI data extraction
        dispatch(new \App\Jobs\ProcessMakeHookCatawiki($watch));

        return back()->with('success', 'AI data is being generating. This may take a moment.');
    }
}
