<?php

namespace App\Http\Controllers\Web;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class PreviewImageController extends Controller
{
    /**
     * Handle the incoming request.
     */
    public function __invoke(Request $request)
    {

        $request->validate(['url' => 'required|string']);

        // Separate MIME type and data
        if (preg_match('/^data:(.*);base64,(.*)$/', $request->input('url'), $matches)) {
            $mime = $matches[1];
            $data = base64_decode($matches[2]);

            return response($data)
                ->header('Content-Type', $mime)
                ->header('Content-Disposition', 'inline'); // Preview in browser
        }


        /// Fallback to storage file
        if (Storage::exists($request->input('url'))) {
            return response(Storage::get($request->input('url')))
                ->header('Content-Type', Storage::mimeType($request->input('url')))
                ->header('Content-Disposition', 'inline');
        }

        return abort(404);
    }
}
