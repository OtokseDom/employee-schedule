<?php

if (!function_exists('apiResponse')) {
    /**
     * Generate a standard JSON API response.
     *
     * @param mixed  $data
     * @param string $message
     * @param bool   $success
     * @param int    $code
     * @return \Illuminate\Http\JsonResponse
     */
    function apiResponse($data = null, $message = '', $success = true, $code = 200)
    {
        return response()->json([
            'success' => $success,
            'message' => $message,
            'data'    => $data,
        ], $code);
    }
}