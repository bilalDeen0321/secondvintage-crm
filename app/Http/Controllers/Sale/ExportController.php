<?php

namespace App\Http\Controllers\Sale;

use App\Http\Controllers\Controller;
use App\Models\Watch;
use App\Exports\CatawikiExport;
use App\Models\PlatformData;
use Illuminate\Http\Request;
use Illuminate\Support\Sleep;
use Maatwebsite\Excel\Facades\Excel;

class ExportController extends Controller
{
    /**
     * Export to catawiki to csv.
     */
    public function catawiki(Request $request)
    {
        $request->validate([
            'ids' => 'required|array',
            'ids.*' => 'exists:watches,id',
            'platform' => 'string|in:catawiki,tradera'
        ]);

        $ids = $request->input('ids', []);

        // Check if all selected watches are set to Catawiki platform
        $invalidWatch = Watch::query()
            ->whereIn('id', $ids)
            ->where(function ($q) {
                $q->whereNull('platform')
                    ->orWhere('platform', '!=', PlatformData::CATAWIKI);
            })
            ->first();

        if ($invalidWatch) {
            return back()->with('warning', "Watch '{$invalidWatch->name}' is not set to Catawiki platform.");
        }

        Sleep::for(3)->seconds();

        // Generate filename with timestamp
        $filename = 'Catawiki_export_' . now()->format('Y-m-d') . '.csv';

        return Excel::download(new CatawikiExport($ids), $filename);
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
