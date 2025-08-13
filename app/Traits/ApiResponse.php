<?php

namespace App\Traits;

trait ApiResponse
{

    /**
     * Send api success response
     */
    public function apiSuccess(string $message = 'Successfully', int $status = 200)
    {
        return response()->json(['success'  => true,  'message' => $message], $status);
    }

    /**
     * Send api error response
     */
    public function apiError(string $message = 'Somthing went wrong', int $status = 200)
    {
        return response()->json(['success'  => false,  'message' => $message], $status);
    }

    /**
     * Send api message response
     */
    public function apiMessage(string $message = 'Api message', bool $success, int $status = 200)
    {
        return response()->json(['success'  => $success,  'message' => $message], $status);
    }


    /**
     * Paginated response
     */
    public function paginatedResponse($data, string $message = 'Success')
    {
        return response()->json([
            'status'  => 'success',
            'message' => $message,
            'data'    => $data->items(),
            'meta'    => [
                'current_page' => $data->currentPage(),
                'last_page'    => $data->lastPage(),
                'per_page'     => $data->perPage(),
                'total'        => $data->total(),
            ],
        ]);
    }
}
