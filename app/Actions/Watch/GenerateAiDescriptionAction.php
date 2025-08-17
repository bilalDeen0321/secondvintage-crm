<?php

namespace App\Actions\Watch;

use App\Models\Status;
use App\Models\WatchImage;
use App\Services\Api\MakeAiHook;
use Illuminate\Http\Request;

class GenerateAiDescriptionAction
{
    /**
     * Create a new class instance.
     */
    public function __construct()
    {
        //
    }

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
            'Image_URLs'      => $this->image_urls($request->input('images')),
            'Platform'        => $request->string('platform', 'Catawiki'),
            'Status_Selected' => $request->string('status'),
            'AI_Instruction'  => $request->input('ai_instructions'),
        ];
        // $payload['Image_URLs'] = $this->processImages($request->input('images'));

        // $payload['Image_URLs'] = ['https://upload.wikimedia.org/wikipedia/commons/thumb/c/cd/Casio_OCEANUS_OCW-S1350PC-1AJR_01.JPG/500px-Casio_OCEANUS_OCW-S1350PC-1AJR_01.JPG'];

        return $payload;


        $data = array_filter($payload);

        $make = MakeAiHook::init()->generateDescription($data);

        if ($make->get('Status') === 'success') {
            return response()->json([
                'status'          => 'success',
                'description'     => $make->get('Description') ?? 'No description',
                'ai_thread_id'    => $make->get('Thread_ID'),
                'status_selected' => $make->get('Status_Selected') ?? Status::DRAFT,
            ]);
        }

        // If Make.com fails
        throw new \RuntimeException(
            $make->get('Message') ?? 'Something went wrong with make.com'
        );
    }

    /**
     * Get image url
     */
    private function image_urls($images)
    {

        return collect($images)->map(function ($image) {

            $url = $image['url'] ?? null;

            if (!$url) {
                return null; // skip if no URL
            }

            // If it's a base64 image, return as is
            if (str_starts_with($url, 'data:image')) {
                $base = 'https://f7b3724b1b6c.ngrok-free.app';

                return "$base/url?$url";
                return route('preview-image', ['url' => $url]);
            }

            // First check if the file exists in storage
            if (\Illuminate\Support\Facades\Storage::exists($url)) {
                return url(\Illuminate\Support\Facades\Storage::url($url));
            }

            // Fallback: return the original URL (could be http, https, or base64)
            return $url;

            //ok
        })->filter()->values()->all();
    }

    /**
     * Process the images to safely return URLs for ChatGPT
     *
     * @param array $images
     * @return array
     */
    private function processImages(array $images): array
    {
        return collect($images)->map(function ($image) {

            $url = $image['url'] ?? null;

            if (!$url) {
                return null; // skip if no URL
            }

            // If it's a base64 image, return as is
            if (str_starts_with($url, 'data:image')) {
                return WatchImage::uploadBase64Image($url);
            }

            // First check if the file exists in storage
            if (\Illuminate\Support\Facades\Storage::exists($url)) {
                return url(\Illuminate\Support\Facades\Storage::url($url));
            }

            // Fallback: return the original URL (could be http, https, or base64)
            return $url;
        })->filter()->values()->all(); // remove nulls and reindex
    }
}
