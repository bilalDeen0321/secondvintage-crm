<?php

namespace App\Http\Controllers\Web;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Storage;

class PreviewImageController extends Controller
{
    /**
     * Handle the incoming request.
     */
    public function __invoke(Request $request)
    {

        $path = $request->input('path');

        // Handle Base64
        if (preg_match('/^data:(.*);base64,(.*)$/', Cache::get($path, $path), $matches)) {

            $mime = $matches[1];
            $data = base64_decode($matches[2]);
            $ext = explode('/', $mime)[1] ?? 'png';
            $filename = "file.$ext";

            return response($data)
                ->header('Content-Type', $mime)
                ->header('Content-Disposition', "inline; filename=\"$filename\"");
        }

        // Optional fallback to storage
        if (Storage::exists($path)) {
            return response(Storage::get($path))
                ->header('Content-Type', Storage::mimeType($path))
                ->header('Content-Disposition', 'inline');
        }

        return abort(404);
    }
}
