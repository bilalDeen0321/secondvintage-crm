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
use Illuminate\Support\Facades\Log as LaravelLog;
use Illuminate\Support\Collection;

class ProcessWatchAIDescriptionJob implements ShouldQueue
{
    use Queueable, Dispatchable, SerializesModels;

    /**
     * @param int $attempt current attempt number (1 = first, 2 = first retry, 3 = final retry)
     */
    public function __construct(public Watch $watch, public int $attempt = 1) {}

    public function handle(): void
    {
        try {
            $this->handler();
        } catch (\Throwable $th) {
            Log::error('Failed AI generate description', $th->getMessage());

            $this->updateWatchStatus(WatchAiStatus::failed, [
                'ai_message' => $th->getMessage()
            ]);
        }
    }

    private function handler(): void
    {
        // if ($this->attempt === 1) {
            $this->updateWatchStatus(WatchAiStatus::loading);
        // }

        $payload = [
            'AI_Action'       => 'generate_description',
            'SKU'             => $this->watch->sku ?? null,
            'Name'            => $this->watch->name ?? null,
            'Brand'           => $this->watch?->brand?->name ?? null,
            'Serial'          => $this->watch->serial_number ?? null,
            'Ref'             => $this->watch->reference ?? null,
            'Case_Size'       => $this->watch->case_size ?? null,
            'Wrist_size'       => $this->watch->wrist_size ?? null,
            'Caliber'         => $this->watch->caliber ?? null,
            'Timegrapher'     => $this->watch->timegrapher ?? null,
            'Platform'        => $this->watch->platformData ?? 'Catawiki',
            'Status_Selected' => $this->watch->status ?? Status::DRAFT,
            'AI_Instruction'  => $this->watch->ai_instructions ?? null,
            'Image_URLs'      => $this->watch->ai_image_urls,
            'Thread_ID'       => $this->watch->ai_thread_id,
        ];

        $payload = array_filter($payload, fn($v) => $v !== null);

        if (app()->environment('local')) {
            $payload['Image_URLs'] = [
                'https://test.secondvintage.com/storage/watches/images/CIT-CCX-0001_001.jpg'
            ];
        }

        try {
            $make = MakeAiHook::init()->generateDescription($payload);
         
            LaravelLog::info('Make.com AI response', $make->toArray());

            $httpStatus = (int) $make->get('HttpStatus', 500);

            switch ($httpStatus) {
                case 202:
                    // $this->handleProcessing($make);
                    break;

                case 200:
                    $this->handleSuccess($make);
                    break;

                default:
                    $this->handleFailure($make);
                    break;
            }
        } catch (\Throwable $th) {
            Log::error('Failed AI generate description', $th->getMessage());
            $this->updateWatchStatus(WatchAiStatus::failed, [
                'ai_message' => $th->getMessage()
            ]);
        }
    }

    /**
     * Handle Make.com "processing" (HTTP 202) response.
     * Retries up to 3 total attempts (1 initial + 2 follow-ups).
     */
    private function handleProcessing(Collection $make): void
    {
        $this->updateWatchStatus(WatchAiStatus::loading, [
            'ai_message' => $make->get('Message', 'AI is processing...')
        ]);

        // Using Laravel's built-in attempt counter
        if ($this->attempts() >= 5) {
            $this->updateWatchStatus(WatchAiStatus::failed, [
                'ai_message' => 'AI request timed out after multiple retries.'
            ]);
            return;
        }

        LaravelLog::info("Attempt #{$this->attempts()} still processing, scheduling retry...", [
            'watch_id' => $this->watch->id,
            'message'  => $make->get('Message'),
        ]);

        // Dispatch same job again after 1 minute
        self::dispatch($this->watch)
            ->delay(now()->addMinute())
            ->onQueue($this->queue ?? 'default');
    }


    private function handleSuccess(Collection $make): void
    {
        LaravelLog::info('AI description generated',  $this->watch->id);

        $this->watch->update([
            'status'       => $make->get('Status_Selected') ?? Status::DRAFT,
            'ai_status'    => WatchAiStatus::success,
            'ai_message'   => $make->get('Message'),
            'ai_thread_id' => $make->get('Thread_ID'),
            'description'  => ai_description_format($make->get('Description')),
        ]);

        $this->watch->refresh();

        event(new \App\Events\WatchAiDescriptionProcessedEvent($this->watch));
    }

    private function handleFailure(Collection $make): void
    {
        $message = $make->get('Message', 'AI description failed');
        Log::error('AI description failed', $message);

        $this->updateWatchStatus(WatchAiStatus::failed, [
            'ai_message' => $message
        ]);
    }

    private function updateWatchStatus(string $status, array $attributes = []): void
    {
        if ($this->watch instanceof Watch) {
            $this->watch->update(array_merge(['ai_status' => $status], $attributes));
            $this->watch->refresh();

            event(new \App\Events\WatchAiDescriptionProcessedEvent($this->watch));
        }
    }

    private function getImageUrls(array|string|null $urls): array
    {
        if (is_array($urls)) {
            return array_values(array_filter($urls, fn($url) => is_string($url)));
        }

        return [];
    }
}
