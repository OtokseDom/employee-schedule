<?php

use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\CategoryController;
use App\Http\Controllers\Api\DashboardReportController;
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

    Route::get('/user-auth', function (Request $request) {
        return $request->user();
    });
    Route::post('/logout', [AuthController::class, 'logout']);
    /* --------------------------------- Masters -------------------------------- */
    // Route::apiResource('/user-auth', UserController::class); //somehow implicit route is not working
    // User CRUD
    Route::get('/user', [UserController::class, 'index']);
    Route::post('/user', [UserController::class, 'store']);
    Route::get('/user/{user}', [UserController::class, 'show']);
    Route::put('/user/{user}', [UserController::class, 'update']);
    Route::delete('/user/{user}', [UserController::class, 'destroy']);
    Route::apiResource('/category', CategoryController::class);
    Route::apiResource('/task', TaskController::class);
    Route::apiResource('/task-history', TaskHistoryController::class);

    /* --------------------------------- Reports -------------------------------- */
    Route::get('/user/{id}/reports', [UserReportController::class, 'userReports']);
    Route::get('/dashboard', [DashboardReportController::class, 'dashboardReports']);
});

Route::post('/signup', [AuthController::class, 'signup']);
Route::post('/login', [AuthController::class, 'login']);
