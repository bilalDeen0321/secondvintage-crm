<?php

namespace App\Http\Controllers\Api;

use App\Actions\Watch\GenerateAiDescription;
use App\Http\Controllers\Controller;
use App\Models\Status;
use App\Services\Api\MakeAiHook;
use Illuminate\Http\Request;

class MakeAiHookController extends Controller
{
    /**
     * Hanld make.com ai generate watch description.
     */
    public function generate(Request $request, GenerateAiDescription $action)
    {

        $request->validate([
            'name'              => 'required|string',
            'ai_instructions'   => 'required|string',
            'ai_thread_id'      => 'nullable|string',
            'sku'               => 'nullable|string',
            'brand'             => 'nullable|string',
            'serial_number'     => 'nullable|string',
            'reference'         => 'nullable|string',
            'case_size'         => 'nullable|string',
            'caliber'           => 'nullable|string',
            'timegrapher'       => 'nullable|string',
            'image_urls'        => 'nullable|array',
            'platform'          => 'nullable|string',
            'status'            => 'nullable|string',

            // images is an array of base64 strings inside objects
            'images'          => ['nullable', 'array'],
            'images.*.url'    => ['required_with:images', 'string'],
        ]);

        return $action($request);
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
