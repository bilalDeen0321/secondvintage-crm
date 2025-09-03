<?php

namespace App\Jobs;

use App\Actions\Platform\ExtractMakeHookToCatawiki;
use App\Models\Log;
use App\Models\PlatformData;
use App\Models\Status;
use App\Models\Watch;
use App\Services\Api\MakeAiHook;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Queue\Queueable;
use Illuminate\Queue\SerializesModels;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Support\Collection;

class ProcessMakeHookCatawiki implements ShouldQueue
{
    use Queueable, Dispatchable, SerializesModels;

    /**
     * Create a new job instance.
     */
    public function __construct(public Watch $watch, public PlatformData $platform)
    {
        //
    }

    /**
     * Execute the job.
     */
    public function handle(): void
    {
        try {
            $this->handler();
        } catch (\Throwable $th) {

            Log::error('Failed ai generate catawiki', $th->getMessage());

            $this->updatePlatformStatus(PlatformData::STATUS_FAILED, ['message' => $th->getMessage()]);
        }
    }

    /**
     * Process the Make Hook for Catawiki.
     */
    private function handler(): void
    {

        $this->updatePlatformStatus(PlatformData::STATUS_LOADING);

        $payload = [
            'SKU'             => $this->watch->sku ?? null,
            'Name'            => $this->watch->name ?? null,
            'Brand'           => $this->watch?->brand?->name ?? null,
            'Serial'          => $this->watch->serial_number ?? null,
            'Ref'             => $this->watch->reference ?? null,
            'Case_Size'       => $this->watch->case_size ?? null,
            'Caliber'         => $this->watch->caliber ?? null,
            'Timegrapher'     => $this->watch->timegrapher ?? null,
            'Platform'        => 'Catawiki',
            'Description'     => $this->watch->description ?? null,
            'Status_Selected' => $this->watch->status ?? Status::DRAFT,
            'Image_URLs'      => $this->watch->ai_image_urls,
        ];

        $payload = array_filter($payload, fn($v) => $v !== null);

        try {
            $make = MakeAiHook::init()->generateCatawikiData($payload);

            if ($make->get('Status') === 'success') {
                $this->handleSuccess($make);
            } else {
                $this->handleFailure($make);
            }
        } catch (\Throwable $th) {
            $this->updatePlatformStatus(PlatformData::STATUS_FAILED, ['message' => $th->getMessage()]);
        }
    }

    private function handleSuccess(Collection $make): void
    {
        $this->platform->update([
            'status' => PlatformData::STATUS_SUCCESS,
            'data'   => ExtractMakeHookToCatawiki::execute($make),
        ]);

        event(new \App\Events\ProcessPlatformEvent($this->watch, $this->platform));
    }

    /**
     * Handle failed AI fill data data attempt.
     */
    private function handleFailure(Collection $make): void
    {
        $message = $make->get('Message', 'AI catawiki failed');

        $this->updatePlatformStatus(PlatformData::STATUS_FAILED, ['message' => $message]);
    }


    /**
     * Update platform status and additional data if needs.
     */
    private function updatePlatformStatus(string $status, array $attributes = []): void
    {
        if ($this->platform instanceof PlatformData) {

            $this->platform->update(array_merge(['status' => $status], $attributes));

            // Broadcast the event
            event(new \App\Events\ProcessPlatformEvent($this->watch, $this->platform));
        }
    }
}
