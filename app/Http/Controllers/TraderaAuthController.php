<?php

namespace App\Http\Controllers;

use App\Services\TraderaLogger;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Inertia\Inertia;

class TraderaAuthController extends Controller
{
    protected TraderaLogger $traderaLogger;

    public function __construct(TraderaLogger $traderaLogger)
    {
        $this->traderaLogger = $traderaLogger;
    }

    /**
     * Handle successful Tradera authorization
     */
    public function handleSuccess(Request $request)
    {
        $token = $request->input('token');
        $userId = $request->input('userId');

        if ($token && $userId) {
            // Log successful authorization
            $this->traderaLogger->logAuth(
                'auth_callback_success',
                true,
                [
                    'user_id' => $userId,
                    'token_length' => strlen($token),
                    'callback_data' => $request->all()
                ]
            );

            // Store the token securely (database, cache, etc.)
            Log::info('Tradera authorization successful', [
                'user_id' => $userId,
                'token_received' => !empty($token)
            ]);

            // Redirect to settings or show success message
            return redirect()->route('settings.index')
                ->with('success', 'Tradera integration authorized successfully!');
        }

        return $this->handleError($request);
    }

    /**
     * Handle failed Tradera authorization
     */
    public function handleError(Request $request)
    {
        $error = $request->input('error', 'Unknown error');

        // Log failed authorization
        $this->traderaLogger->logAuth(
            'auth_callback_error',
            false,
            $request->all(),
            $error
        );

        Log::error('Tradera authorization failed', [
            'error' => $error,
            'request_data' => $request->all()
        ]);

        return redirect()->route('settings.index')
            ->with('error', 'Tradera integration authorization failed: ' . $error);
    }
}
