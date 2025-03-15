<?php

use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\EmployeeController;
use App\Http\Controllers\Api\EventController;
use App\Http\Controllers\Api\PerformanceReportController;
use App\Http\Controllers\Api\ScheduleController;
use App\Http\Controllers\Api\TaskController;
use App\Http\Controllers\Api\TaskHistoryController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

Route::middleware('auth:sanctum')->group(function () {

    Route::get('/user', function (Request $request) {
        return $request->user();
    });
    Route::post('/logout', [AuthController::class, 'logout']);
    /* --------------------------------- Masters -------------------------------- */
    Route::apiResource('/schedule', ScheduleController::class);
    Route::apiResource('/employee', EmployeeController::class);
    Route::apiResource('/event', EventController::class);
    Route::apiResource('/task', TaskController::class);
    Route::apiResource('/task-history', TaskHistoryController::class);
    Route::apiResource('/performance-report', PerformanceReportController::class);

    /* ---------------------------- Master Relations ---------------------------- */
    Route::get('/schedule-by-employee/{employeeId}', [ScheduleController::class, 'getScheduleByEmployee']);
});

Route::post('/signup', [AuthController::class, 'signup']);
Route::post('/login', [AuthController::class, 'login']);