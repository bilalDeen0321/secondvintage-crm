<?php

namespace App\Jobs;

use App\Enums\WatchAiStatus;
use App\Models\Status;
use App\Models\Watch;
use App\Services\Api\MakeAiHook;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Foundation\Queue\Queueable;
use Illuminate\Queue\SerializesModels;
use App\Models\Log;
use Illuminate\Support\Collection;
use Illuminate\Support\Sleep;

class ProcessWatchAIDescriptionJob implements ShouldQueue
{
    use Queueable, Dispatchable, SerializesModels;

    /**
     * Create a new job instance.
     */
    public function __construct(public Watch $watch) {}

    /**
     * Execute the job.
     */
    public function handle(): void
    {

        $this->updateWatchStatus(WatchAiStatus::loading);

        if (app()->environment('local')) {
            Sleep::for(rand(3, 20,))->seconds();
        }

        $payload = [
            'AI_Action'       => 'generate_description',
            'SKU'             => $this->watch->sku ?? null,
            'Name'            => $this->watch->name ?? null,
            'Brand'           => $this->watch?->brand?->name ?? null,
            'Serial'          => $this->watch->serial_number ?? null,
            'Ref'             => $this->watch->reference ?? null,
            'Case_Size'       => $this->watch->case_size ?? null,
            'Caliber'         => $this->watch->caliber ?? null,
            'Timegrapher'     => $this->watch->timegrapher ?? null,
            'Platform'        => $this->watch->platformData ?? 'Catawiki',
            'Status_Selected' => $this->watch->status ?? Status::DRAFT,
            'AI_Instruction'  => $this->watch->ai_instructions ?? null,
            'Image_URLs'      => $this->getImageUrls($this->watch->image_urls ?? []),
        ];

        $make = MakeAiHook::init()->generateDescription(array_filter($payload));

        //success handler
        if ($make->get('Status') === 'success') {

            $this->successfull($make);

            return;
        }

        //failer handler
        $this->failer($make);
    }

    /**
     * Handle success ai genareted description with watch
     */
    public function successfull(Collection $make)
    {

        Log::info('AI description successfully generated', $make->get('Description', 'No response'));

        if ($this->watch instanceof Watch) {

            $this->watch->update([
                'status'       => $make->get('Status_Selected') ?? Status::DRAFT,
                'ai_status'    => WatchAiStatus::success,
                'ai_message'   => $make->get('Message'),
                'ai_thread_id' => $make->get('Thread_ID'),
                'description'  => $make->get('Description'),
            ]);

            $this->watch->refresh();

            // Broadcast the event
            event(new \App\Events\WatchAiDescriptionProcessedEvent($this->watch));
        }
    }
    /**
     * Handle success ai genareted description with watch
     */
    public function failer(Collection $make)
    {
        $message  = $make->get('Message', 'Something went wrong with AI');

        Log::error('AI description failed', $message);

        $this->updateWatchStatus(WatchAiStatus::failed, ['ai_message' => $message]);

        throw new \RuntimeException($message);
    }

    /**
     * Update watch AI status.
     */
    private function updateWatchStatus(string $status, array $attributes = []): void
    {
        if ($this->watch instanceof Watch) {

            $this->watch->update(array_merge(['ai_status' => $status], $attributes));

            $this->watch->refresh();

            // Broadcast the event
            event(new \App\Events\WatchAiDescriptionProcessedEvent($this->watch));
        }
    }

    /**
     * Validate and filter image URLs.
     */
    private function getImageUrls(array|string|null $urls): array
    {
        if (is_array($urls)) {
            return array_values(array_filter($urls, fn($url) => is_string($url)));
        }

        return [];
    }
}
