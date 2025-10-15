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
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\Log as LaravelLog;
use App\Models\Log;

class ProcessWatchAIDescriptionJob implements ShouldQueue
{
    use Queueable, Dispatchable, SerializesModels;

    public function __construct(public Watch $watch, public int $attempt = 1) {}

    /**
     * Main queue handler
     */
    public function handle(): void
    {
        try {
            LaravelLog::info('🟦 [AI Job Started]', [
                'watch_id' => $this->watch->id,
                'attempt'  => $this->attempt,
            ]);

            $this->handler();

            LaravelLog::info('🟩 [AI Job Completed]', [
                'watch_id' => $this->watch->id,
            ]);
        } catch (\Throwable $th) {
            LaravelLog::error('🟥 [AI Job Failed]', [
                'watch_id' => $this->watch->id,
                'error'    => $th->getMessage(),
                'trace'    => $th->getTraceAsString(),
            ]);

            Log::error('Failed AI generate description', $th->getMessage());    // DB
            $this->updateWatchStatus(WatchAiStatus::failed, [
                'ai_message' => $th->getMessage(),
            ]);
        }
    }

    /**
     * Ensure text is JSON-safe.
     */
    private function sanitizeForJson($text): ?string
    {
        if ($text === null) return null;

        $text = str_replace(
            ['“', '”', '‘', '’', '´', '`', '–', '—'],
            ['"', '"', "'", "'", "'", "'", '-', '-'],
            $text
        );

        $text = preg_replace("/\r\n|\r|\n/", "\\n", $text);
        $text = mb_convert_encoding($text, 'UTF-8', 'UTF-8');

        return $text;
    }

    /**
     * Recursively sanitize any array or string.
     */
    private function deepSanitize($data)
    {
        if (is_array($data)) {
            return array_map([$this, 'deepSanitize'], $data);
        }
        if (is_string($data)) {
            return $this->sanitizeForJson($data);
        }
        return $data;
    }

    /**
     * Core logic for AI request.
     */
    private function handler(): void
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
            'Wrist_size'      => $this->watch->wrist_size ?? null,
            'Caliber'         => $this->watch->caliber ?? null,
            'Timegrapher'     => $this->watch->timegrapher ?? null,
            'Platform'        => $this->watch->platformData ?? 'Catawiki',
            'Status_Selected' => $this->watch->status ?? Status::DRAFT,
            'AI_Instruction'  => $this->watch->ai_instructions ?? null,
            'Image_URLs'      => $this->watch->ai_image_urls,
            'Thread_ID'       => '',
        ];

        // Remove null values and sanitize all strings
        $payload = array_filter($payload, fn($v) => $v !== null);
        $payload = $this->deepSanitize($payload);

        dump($payload);
        // Use a test image locally
        // if (app()->environment('local')) {
        //     $payload['Image_URLs'] = [
        //         'https://test.secondvintage.com/storage/watches/images/CIT-CCX-0001_001.jpg',
        //     ];
        // }

        LaravelLog::info('📦 [Sending Payload to Make.com]', [
            'watch_id' => $this->watch->id,
            'payload'  => $payload,
        ]);

        try {
            $make = MakeAiHook::init()->generateDescription($payload);

            LaravelLog::info('📥 [Received Response from Make.com]', [
                'watch_id'  => $this->watch->id,
                'response'  => $make->toArray(),
            ]);

            $httpStatus = (int) $make->get('HttpStatus', 500);

            match ($httpStatus) {
                202 => $this->handleProcessing($make),
                200 => $this->handleSuccess($make),
                default => $this->handleFailure($make),
            };
        } catch (\Throwable $th) {
            LaravelLog::error('🟥 [Make.com Request Failed]', [
                'watch_id' => $this->watch->id,
                'error'    => $th->getMessage(),
                'trace'    => $th->getTraceAsString(),
            ]);

            Log::error('Failed AI generate description', $th->getMessage());    // DB

            $this->updateWatchStatus(WatchAiStatus::failed, [
                'ai_message' => $th->getMessage(),
            ]);
        }
    }

    /**
     * Handle Make.com "processing" (HTTP 202)
     */
    private function handleProcessing(Collection $make): void
    {
        $this->updateWatchStatus(WatchAiStatus::loading, [
            'ai_message' => $make->get('Message', 'AI is processing...'),
        ]);

        if ($this->attempts() >= 5) {
            $this->updateWatchStatus(WatchAiStatus::failed, [
                'ai_message' => 'AI request timed out after multiple retries.',
            ]);
            return;
        }

        LaravelLog::info('⏳ [AI Still Processing - Retrying]', [
            'watch_id' => $this->watch->id,
            'attempt'  => $this->attempts(),
        ]);

        self::dispatch($this->watch)
            ->delay(now()->addMinute())
            ->onQueue($this->queue ?? 'default');
    }

    /**
     * Handle Make.com success (HTTP 200)
     */
    private function handleSuccess(Collection $make): void
    {
        LaravelLog::info('✅ [AI Description Generated]', [
            'watch_id' => $this->watch->id,
            'message'  => $make->get('Message'),
        ]);

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

    /**
     * Handle Make.com failure or unknown HTTP status.
     */
    private function handleFailure(Collection $make): void
    {
        $message = $make->get('Message', 'AI description failed');
        
        LaravelLog::error('❌ [AI Description Failed]', [
            'watch_id' => $this->watch->id,
            'message'  => $message,
            'response' => $make->toArray(),
        ]);
        
        Log::error('AI description failed', $message);  // DB

        $this->updateWatchStatus(WatchAiStatus::failed, [
            'ai_message' => $message,
        ]);
    }

    /**
     * Update Watch model status + trigger event
     */
    private function updateWatchStatus(string $status, array $attributes = []): void
    {
        if (!($this->watch instanceof Watch)) {
            LaravelLog::warning('⚠️ [updateWatchStatus called without valid Watch instance]');
            return;
        }

        $this->watch->update(array_merge(['ai_status' => $status], $attributes));
        $this->watch->refresh();

        event(new \App\Events\WatchAiDescriptionProcessedEvent($this->watch));

        LaravelLog::info('🔄 [Watch Status Updated]', [
            'watch_id' => $this->watch->id,
            'ai_status' => $status,
            'attributes' => $attributes,
        ]);
    }
}
