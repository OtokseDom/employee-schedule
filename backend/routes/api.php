<?php

use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\EmployeeController;
use App\Http\Controllers\Api\EventController;
use App\Http\Controllers\Api\PerformanceReportController;
use App\Http\Controllers\Api\ScheduleController;
use App\Http\Controllers\Api\TaskController;
use App\Http\Controllers\Api\TaskHistoryController;
use App\Http\Controllers\Api\UserController;
use App\Http\Controllers\Api\UserReportController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

Route::middleware('auth:sanctum')->group(function () {

    Route::get('/user', function (Request $request) {
        return $request->user();
    });
    Route::post('/logout', [AuthController::class, 'logout']);
    /* --------------------------------- Masters -------------------------------- */
    // Route::apiResource('/user-auth', UserController::class); //somehow implicit route is not working
    // User CRUD
    Route::get('/user-auth', [UserController::class, 'index']);
    Route::post('/user-auth', [UserController::class, 'store']);
    Route::get('/user-auth/{user}', [UserController::class, 'show']);
    Route::put('/user-auth/{user}', [UserController::class, 'update']);
    Route::delete('/user-auth/{user}', [UserController::class, 'destroy']);
    Route::apiResource('/schedule', ScheduleController::class);
    Route::apiResource('/employee', EmployeeController::class);
    Route::apiResource('/event', EventController::class);
    Route::apiResource('/task', TaskController::class);
    Route::apiResource('/task-history', TaskHistoryController::class);
    Route::apiResource('/performance-report', PerformanceReportController::class);

    /* ---------------------------- Master Relations ---------------------------- */
    Route::get('/schedule-by-user/{userId}', [ScheduleController::class, 'getScheduleByUser']);

    /* --------------------------------- Reports -------------------------------- */
    Route::get('/tasks-by-status/{id}', [UserReportController::class, 'tasksByStatus']);
    Route::get('/task-activity-timeline/{id}', [UserReportController::class, 'taskActivityTimeline']);
});

Route::post('/signup', [AuthController::class, 'signup']);
Route::post('/login', [AuthController::class, 'login']);