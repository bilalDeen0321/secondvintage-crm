<?php

namespace App\Jobs;

use App\Enums\WatchAiStatus;
use App\Models\Status;
use App\Models\Watch;
use App\Services\Api\MakeAiHook;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Foundation\Queue\Queueable;
use Illuminate\Queue\SerializesModels;
use App\Models\Log;
use App\Support\Str;
use Illuminate\Support\Facades\Log as FacadesLog;
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


        /**
         * Create test case
         */

        Sleep::for(10)->seconds();

        $status = fake()->randomElement([WatchAiStatus::success, WatchAiStatus::failed]);

        $this->watch->update([
            'status'       => Status::REVIEW,
            'ai_status'    => $status,
            'ai_thread_id' => Str::uuid(),
            'description'  => $status === WatchAiStatus::success ? fake()->sentences : null,
        ]);

        $this->updateWatchStatus(WatchAiStatus::failed);

        return;

        /**
         * end of the thest case
         */

        $data = array_filter($payload);

        $make = MakeAiHook::init()->generateDescription($data);

        if ($make->get('Status') === 'success') {
            Log::info('AI description generated', $make->get('Description', 'No response'));

            if ($this->watch instanceof Watch) {

                $this->watch->update([
                    'status'       => $make->get('Status_Selected') ?? Status::DRAFT,
                    'ai_status'    => WatchAiStatus::success,
                    'ai_thread_id' => $make->get('Thread_ID'),
                    'description'  => $make->get('Description'),
                ]);

                $this->watch->refresh();

                // Broadcast the event
                event(new \App\Events\WatchAiDescriptionProcessedEvent($this->watch));
            }

            return;
        }

        Log::error('AI description failed', $make->get('Message', 'Something went wrong with AI'));

        $this->updateWatchStatus(WatchAiStatus::failed);

        throw new \RuntimeException($make->get('Message') ?? 'Something went wrong with make.com');
    }

    /**
     * Update watch AI status.
     */
    private function updateWatchStatus(string $status): void
    {
        if ($this->watch instanceof Watch) {

            $this->watch->update(['ai_status' => $status]);

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
