<?php

use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\CategoryController;
use App\Http\Controllers\Api\DashboardReportController;
use App\Http\Controllers\Api\OrganizationController;
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
    // User CRUD
    Route::apiResource('/user', UserController::class);
    Route::apiResource('/category', CategoryController::class);
    Route::apiResource('/task', TaskController::class);
    Route::apiResource('/task-history', TaskHistoryController::class);

    /* --------------------------------- Reports -------------------------------- */
    Route::get('/user/{id}/reports', [UserReportController::class, 'userReports']);
    Route::get('/dashboard', [DashboardReportController::class, 'dashboardReports']);
});
Route::apiResource('/organization', OrganizationController::class);
Route::post('/signup', [AuthController::class, 'signup']);
Route::post('/login', [AuthController::class, 'login']);
