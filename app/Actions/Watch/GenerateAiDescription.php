<?php

namespace App\Actions\Watch;

use App\Models\Status;
use App\Services\Api\MakeAiHook;
use Illuminate\Http\Request;

class GenerateAiDescription
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
            'Image_URLs'      => array_map(fn($img) => $img['url'], $request->array('images', [])),
            'Platform'        => $request->string('platform', 'Catawiki'),
            'Status_Selected' => $request->string('status'),
            'AI_Instruction'  => $request->input('ai_instructions'),
        ];

        $make = MakeAiHook::init()->generateDescription($payload);

        if ($make->get('Status') === 'success') {
            return response()->json([
                'status'          => 'success',
                'thread_id'       => $make->get('Thread_ID'),
                'description'     => $make->get('Description') ?? 'No description',
                'status_selected' => $make->get('Status_Selected') ?? Status::DRAFT,
            ]);
        }

        // If Make.com fails
        throw new \RuntimeException(
            $make->get('Message') ?? 'Something went wrong with make.com'
        );
    }
}
