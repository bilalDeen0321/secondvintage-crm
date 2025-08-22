<?php

namespace App\Actions\Watch;

use App\Models\Status;
use App\Services\Api\MakeAiHook;
use App\Support\Str;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;

class GenerateAiDescriptionAction
{
    /**
     * Invoke the class instance.
     */
    public function __invoke(Request $request)
    {
        $payload = [
            'AI_Action'       => 'generate_description',
            'SKU'             => $request->string('sku'),
            'Name'            => $request->string('name'),
            'Brand'           => $request->string('brand'),
            'Serial'          => $request->input('serial_number'),
            'Ref'             => $request->input('reference'),
            'Case_Size'       => $request->input('case_size'),
            'Caliber'         => $request->input('caliber'),
            'Timegrapher'     => $request->input('timegrapher'),
            'Image_URLs'      => $this->image_urls($request->images ?? []),
            'Thread_ID'       => $request->input('ai_thread_id'),
            'Platform'        => $request->string('platform', 'Catawiki'),
            'Status_Selected' => $request->string('status'),
            'AI_Instruction'  => $request->input('ai_instructions'),
        ];

        $data = array_filter($payload);

        // return MakeAiHook::init()->getSuccessResponseDemoData();

        return MakeAiHook::init()->generateDescription($data);
    }

    /**
     * Get image url
     */
    private function image_urls($images)
    {

        if (app()->environment('local')) {
            return ['https://upload.wikimedia.org/wikipedia/commons/thumb/c/cd/Casio_OCEANUS_OCW-S1350PC-1AJR_01.JPG/500px-Casio_OCEANUS_OCW-S1350PC-1AJR_01.JPG'];
        }

        return collect($images)->map(function ($image) {

            $file = $image['file'] ?? null;

            if (!$file) {
                return null; // skip if no file
            }

            // Base64 string
            if (is_string($file) && str_starts_with($file, 'data:image')) {
                $cacheKey = 'preview_image_from_cache_' . \App\Support\Str::random();
                \Illuminate\Support\Facades\Cache::put($cacheKey, $file, now()->addDay());
                return route('web.preview-image', ['path' => $cacheKey]);
            }

            // Already a stored path (string)
            if (is_string($file) && \Illuminate\Support\Facades\Storage::exists($file)) {
                return url(\Illuminate\Support\Facades\Storage::url($file));
            }

            // Uploaded file
            if ($file instanceof \Illuminate\Http\UploadedFile) {
                $path = $file->store('tmp', 'public'); // only called if it's a real file
                return url(\Illuminate\Support\Facades\Storage::url($path));
            }

            // Fallback for any other string (URL or unknown)
            return is_string($file) ? $file : null;
        })->filter()->values()->all();
    }
}
