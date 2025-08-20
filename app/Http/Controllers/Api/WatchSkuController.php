<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Watch;
use Illuminate\Http\Request;

class WatchSkuController extends Controller
{

    /**
     * Handle new sku generate
     */
    public function generate(Request $request, $oldSku = null)
    {
        $data =  $request->validate([
            'watch_name' => 'required|string',
            'brand_name' => 'required|string'
        ]);

        return [
            'sku' => generateSKU($data['brand_name'], $data['watch_name'], Watch::class, $oldSku),
        ];
    }

    /**
     * Display a listing of the resource.
     */
    public function index()
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
