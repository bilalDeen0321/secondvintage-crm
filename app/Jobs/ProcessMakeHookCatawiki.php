<?php

namespace App\Jobs;

use App\Actions\Platform\ExtractMakeHookToCatawiki;
use App\Models\Log;
use App\Models\PlatformData;
use App\Models\Watch;
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
    public function __construct(public Watch $watch)
    {
        //
    }

    /**
     * Execute the job.
     */
    public function handle(): void
    {
        //
    }

    /**
     * Process the Make Hook for Catawiki.
     */
    private function processCatawiki(): void
    {
        // Implementation for processing Catawiki data using Make AI Hook
    }

    private function handleSuccess(Collection $make): void
    {

        $platformData = $this->watch->platformData()->getQuery()
            ->where('name', 'Catawiki')
            ->first();

        $platformData->update([
            'status' => PlatformData::STATUS_SUCCESS,
            'data'   => ExtractMakeHookToCatawiki::execute($make),
        ]);

        // Broadcast event (optional)
        event(new \App\Events\WatchAiDescriptionProcessedEvent($this->watch));
    }

    /**
     * Handle failed AI fill data data attempt.
     */
    private function handleFailure(Collection $make): void
    {
        $message = $make->get('Message', 'AI description failed');

        Log::error("AI description failed", $message);

        $this->updateWatchStatus(PlatformData::STATUS_FAILED, ['message' => $message]);
    }

    /**
     * Update watch AI status.
     */
    private function updateWatchStatus(string $status, array $attributes = []): void
    {
        if ($this->watch instanceof Watch) {

            $this->watch->platformData()->getQuery()
                ->where('name', 'Catawiki')
                ->update(array_merge(['status' => $status], $attributes));

            // Broadcast the event
            event(new \App\Events\WatchAiDescriptionProcessedEvent($this->watch));
        }
    }
}
