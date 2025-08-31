<?php

namespace App\Services;

use App\Models\TraderaLog;
use App\Models\Watch;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Carbon\Carbon;

class TraderaLogger
{
    protected ?TraderaLog $currentLog = null;

    /**
     * Start logging a Tradera API request
     */
    public function startRequest(
        string $action,
        ?Watch $watch = null,
        array $payload = [],
        string $url = '',
        array $headers = []
    ): TraderaLog {
        $this->currentLog = TraderaLog::create([
            'action' => $action,
            'status' => TraderaLog::STATUS_PENDING,
            'watch_id' => $watch?->id,
            'user_id' => Auth::id(),
            'request_payload' => $payload,
            'request_url' => $url,
            'request_headers' => $this->sanitizeHeaders($headers),
            'started_at' => now(),
            'ip_address' => request()->ip(),
            'user_agent' => request()->userAgent(),
        ]);

        return $this->currentLog;
    }

    /**
     * Log successful response
     */
    public function logSuccess(
        array $responseData = [],
        int $responseStatus = 200,
        string $responseBody = '',
        array $traderaData = []
    ): TraderaLog {
        if (!$this->currentLog) {
            throw new \Exception('No active log to update. Call startRequest() first.');
        }

        $completedAt = now();
        $duration = $this->currentLog->started_at
            ? $completedAt->diffInMilliseconds($this->currentLog->started_at)
            : null;

        $this->currentLog->update([
            'status' => TraderaLog::STATUS_SUCCESS,
            'response_data' => $responseData,
            'response_status' => $responseStatus,
            'response_body' => $this->truncateResponseBody($responseBody),
            'tradera_item_id' => $traderaData['item_id'] ?? null,
            'tradera_order_id' => $traderaData['order_id'] ?? null,
            'tradera_user_id' => $traderaData['user_id'] ?? null,
            'completed_at' => $completedAt,
            'duration_ms' => $duration,
        ]);

        return $this->currentLog;
    }

    /**
     * Log error response
     */
    public function logError(
        string $errorMessage,
        array $errorDetails = [],
        int $responseStatus = 0,
        string $responseBody = ''
    ): TraderaLog {
        if (!$this->currentLog) {
            throw new \Exception('No active log to update. Call startRequest() first.');
        }

        $completedAt = now();
        $duration = $this->currentLog->started_at
            ? $completedAt->diffInMilliseconds($this->currentLog->started_at)
            : null;

        $this->currentLog->update([
            'status' => TraderaLog::STATUS_ERROR,
            'error_message' => $errorMessage,
            'error_details' => $errorDetails,
            'response_status' => $responseStatus,
            'response_body' => $this->truncateResponseBody($responseBody),
            'completed_at' => $completedAt,
            'duration_ms' => $duration,
        ]);

        return $this->currentLog;
    }

    /**
     * Log authentication events
     */
    public function logAuth(
        string $action,
        bool $success,
        array $data = [],
        string $error = ''
    ): TraderaLog {
        return TraderaLog::create([
            'action' => $action,
            'status' => $success ? TraderaLog::STATUS_SUCCESS : TraderaLog::STATUS_ERROR,
            'user_id' => Auth::id(),
            'response_data' => $data,
            'error_message' => $error,
            'started_at' => now(),
            'completed_at' => now(),
            'ip_address' => request()->ip(),
            'user_agent' => request()->userAgent(),
        ]);
    }

    /**
     * Log order sync operations
     */
    public function logOrderSync(
        bool $success,
        int $processedCount = 0,
        array $orders = [],
        string $error = ''
    ): TraderaLog {
        return TraderaLog::create([
            'action' => TraderaLog::ACTION_SYNC_ORDERS,
            'status' => $success ? TraderaLog::STATUS_SUCCESS : TraderaLog::STATUS_ERROR,
            'user_id' => Auth::id(),
            'response_data' => [
                'processed_count' => $processedCount,
                'orders' => $orders
            ],
            'error_message' => $error,
            'started_at' => now(),
            'completed_at' => now(),
            'metadata' => [
                'sync_type' => 'scheduled',
                'orders_processed' => $processedCount
            ]
        ]);
    }

    /**
     * Add metadata to current log
     */
    public function addMetadata(array $metadata): void
    {
        if ($this->currentLog) {
            $existingMetadata = $this->currentLog->metadata ?? [];
            $this->currentLog->update([
                'metadata' => array_merge($existingMetadata, $metadata)
            ]);
        }
    }

    /**
     * Get current log
     */
    public function getCurrentLog(): ?TraderaLog
    {
        return $this->currentLog;
    }

    /**
     * Clear current log
     */
    public function clearCurrentLog(): void
    {
        $this->currentLog = null;
    }

    /**
     * Get statistics
     */
    public function getStats(int $days = 30): array
    {
        $startDate = now()->subDays($days);

        $totalRequests = TraderaLog::where('created_at', '>=', $startDate)->count();
        $successfulRequests = TraderaLog::where('created_at', '>=', $startDate)
            ->where('status', TraderaLog::STATUS_SUCCESS)->count();
        $failedRequests = TraderaLog::where('created_at', '>=', $startDate)
            ->where('status', TraderaLog::STATUS_ERROR)->count();

        $avgDuration = TraderaLog::where('created_at', '>=', $startDate)
            ->whereNotNull('duration_ms')
            ->avg('duration_ms');

        $actionStats = TraderaLog::where('created_at', '>=', $startDate)
            ->selectRaw('action, COUNT(*) as count, AVG(duration_ms) as avg_duration')
            ->groupBy('action')
            ->get()
            ->keyBy('action');

        return [
            'total_requests' => $totalRequests,
            'successful_requests' => $successfulRequests,
            'failed_requests' => $failedRequests,
            'success_rate' => $totalRequests > 0 ? round(($successfulRequests / $totalRequests) * 100, 2) : 0,
            'avg_duration_ms' => round($avgDuration ?? 0, 2),
            'avg_duration_seconds' => round(($avgDuration ?? 0) / 1000, 2),
            'action_stats' => $actionStats
        ];
    }

    /**
     * Private helper methods
     */
    private function sanitizeHeaders(array $headers): array
    {
        $sanitized = [];
        $sensitiveKeys = ['authorization', 'x-tradera-token', 'x-tradera-appkey'];

        foreach ($headers as $key => $value) {
            if (in_array(strtolower($key), $sensitiveKeys)) {
                $sanitized[$key] = '***REDACTED***';
            } else {
                $sanitized[$key] = $value;
            }
        }

        return $sanitized;
    }

    private function truncateResponseBody(string $body, int $maxLength = 10000): string
    {
        if (strlen($body) > $maxLength) {
            return substr($body, 0, $maxLength) . '... [TRUNCATED]';
        }
        return $body;
    }
}
