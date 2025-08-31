<?php

namespace App\Http\Controllers;

use App\Models\Watch;
use App\Services\Platform\TraderaService;
use App\Services\TraderaLogger;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Log;

class TraderaController extends Controller
{
    protected TraderaService $traderaService;
    protected TraderaLogger $traderaLogger;

    public function __construct(TraderaService $traderaService, TraderaLogger $traderaLogger)
    {
        $this->traderaService = $traderaService;
        $this->traderaLogger = $traderaLogger;
        $this->middleware('permission:multiplatformSales');
    }

    /**
     * Create listing on Tradera platform
     */
    public function createListing(Request $request): JsonResponse
    {
        $request->validate([
            'watch_id' => 'required|exists:watches,id',
            'platform' => 'required|in:Tradera (Auction)'
        ]);

        try {
            $watch = Watch::findOrFail($request->watch_id);

            // Create listing via Tradera service
            $response = $this->traderaService->createListingFromWatch($watch);

            if ($response->get('Status') === 'success') {
                // Update watch status to "Ready for listing"
                $watch->update(['status' => 'Ready for listing']);

                // Log successful listing
                Log::info('Tradera listing created successfully', [
                    'watch_id' => $watch->id,
                    'sku' => $watch->sku,
                    'response' => $response->toArray()
                ]);

                return response()->json([
                    'success' => true,
                    'message' => 'Watch successfully listed on Tradera',
                    'data' => $response->toArray()
                ]);
            }

            return response()->json([
                'success' => false,
                'message' => $response->get('Message', 'Failed to create Tradera listing'),
                'error' => $response->toArray()
            ], 422);
        } catch (\Exception $e) {
            Log::error('Tradera listing creation failed', [
                'watch_id' => $request->watch_id,
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);

            return response()->json([
                'success' => false,
                'message' => 'An error occurred while creating the listing',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Bulk create listings for multiple watches
     */
    public function bulkCreateListings(Request $request): JsonResponse
    {
        $request->validate([
            'watch_ids' => 'required|array|min:1',
            'watch_ids.*' => 'exists:watches,id',
            'platform' => 'required|in:Tradera (Auction)'
        ]);

        $results = [];
        $successCount = 0;
        $errorCount = 0;
        $bulkStartTime = now();

        // Log bulk operation start
        $bulkLog = $this->traderaLogger->startRequest(
            'bulk_create_listings',
            null,
            [
                'watch_ids' => $request->watch_ids,
                'platform' => $request->platform,
                'watch_count' => count($request->watch_ids)
            ]
        );

        foreach ($request->watch_ids as $watchId) {
            try {
                $watch = Watch::findOrFail($watchId);
                $response = $this->traderaService->createListingFromWatch($watch);

                if ($response->get('Status') === 'success') {
                    $watch->update(['status' => 'Ready for listing']);
                    $successCount++;
                    $results[$watchId] = [
                        'success' => true,
                        'message' => 'Listed successfully'
                    ];
                } else {
                    $errorCount++;
                    $results[$watchId] = [
                        'success' => false,
                        'message' => $response->get('Message', 'Failed to create listing')
                    ];
                }
            } catch (\Exception $e) {
                $errorCount++;
                $results[$watchId] = [
                    'success' => false,
                    'message' => $e->getMessage()
                ];

                Log::error('Bulk listing error for watch', [
                    'watch_id' => $watchId,
                    'error' => $e->getMessage()
                ]);
            }
        }

        $responseData = [
            'success' => $successCount > 0,
            'message' => "Successfully listed {$successCount} watches. {$errorCount} failed.",
            'results' => $results,
            'summary' => [
                'total' => count($request->watch_ids),
                'success' => $successCount,
                'errors' => $errorCount
            ]
        ];

        // Log bulk operation completion
        if ($successCount > 0) {
            $this->traderaLogger->logSuccess(
                $responseData,
                200,
                '',
                ['bulk_success_count' => $successCount]
            );
        } else {
            $this->traderaLogger->logError(
                'All bulk listings failed',
                ['error_count' => $errorCount]
            );
        }

        return response()->json($responseData);
    }

    /**
     * Sync orders from Tradera (similar to the old API)
     */
    public function syncOrders(): JsonResponse
    {
        try {

            /** @var mixed $this */
            $result = $this->traderaService->syncOrders();

            if ($result->get('Status') === 'success') {
                return response()->json([
                    'success' => true,
                    'message' => $result->get('Message'),
                    'processed_count' => $result->get('ProcessedCount', 0),
                    'data' => $result->toArray()
                ]);
            } else {
                return response()->json([
                    'success' => false,
                    'message' => $result->get('Message'),
                    'error' => $result->toArray()
                ], 422);
            }
        } catch (\Exception $e) {
            Log::error('Tradera order sync failed', [
                'error' => $e->getMessage()
            ]);

            return response()->json([
                'success' => false,
                'message' => 'Failed to sync orders',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Get Tradera authorization URL
     */
    public function getAuthUrl(): JsonResponse
    {
        try {

            /** @var mixed $this */
            $authUrl = $this->traderaService->getAuthorizationUrl();

            return response()->json([
                'success' => true,
                'auth_url' => $authUrl
            ]);
        } catch (\Exception $e) {
            Log::error('Failed to generate Tradera auth URL', [
                'error' => $e->getMessage()
            ]);

            return response()->json([
                'success' => false,
                'message' => 'Failed to generate authorization URL'
            ], 500);
        }
    }

    /**
     * Get Tradera API statistics
     */
    public function getStats(Request $request): JsonResponse
    {
        $days = $request->input('days', 30);
        $stats = $this->traderaLogger->getStats($days);

        return response()->json([
            'success' => true,
            'stats' => $stats
        ]);
    }

    /**
     * Get Tradera logs with pagination
     */
    public function getLogs(Request $request): JsonResponse
    {
        $query = \App\Models\TraderaLog::with(['watch', 'user'])
            ->orderBy('created_at', 'desc');

        if ($request->has('action')) {
            $query->where('action', $request->action);
        }

        if ($request->has('status')) {
            $query->where('status', $request->status);
        }

        if ($request->has('watch_id')) {
            $query->where('watch_id', $request->watch_id);
        }

        $logs = $query->paginate($request->input('per_page', 50));

        return response()->json([
            'success' => true,
            'logs' => $logs
        ]);
    }
}
